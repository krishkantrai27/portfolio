import { buildSystemPrompt } from "../lib/knowledge.mjs";
import { getPortfolioText } from "../lib/portfolio.mjs";

const MAX_MESSAGES = 10;
const MAX_CHARS = 500;
const MAX_BODY_BYTES = 20000;
const WINDOW_MS = 60000;
const MAX_REQUESTS = 8;
const TIMEOUT_MS = 15000;

const ABUSE_REGEX = /\b(fuck|fucking|fucker|sex|sexual|porn|bitch|bastard|bsdk|mc|bc|madarchod|chutiya|chootiya|randi|gand|gandu|bhosdike|bhosdi|lauda|loda|harami|saala)\b/i;
const FLAGGED_RESPONSE = "I'm here to discuss Krish's professional background. Please keep the conversation respectful.";
const TROUBLE_RESPONSE = "I'm having trouble responding right now. Please try again shortly.";

const hits = new Map();

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

const allowedOrigins = () =>
  (process.env.ALLOWED_ORIGINS || "https://krishkant.netlify.app,http://localhost:8888,http://localhost:4321")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const originAllowed = (req) => {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
  return allowedOrigins().includes(origin);
};

const isRateLimited = (ip) => {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_REQUESTS;
};

const sanitize = (raw) => {
  if (!Array.isArray(raw)) return null;
  const clean = raw
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, MAX_CHARS) }))
    .filter((m) => m.content)
    .slice(-MAX_MESSAGES);
  while (clean[0]?.role === "assistant") clean.shift();
  if (!clean.length || clean[clean.length - 1].role !== "user") return null;
  return clean;
};

const stripBranding = (text) => {
  if (!text) return "";
  return text
    .replace(/(?:\r?\n)*(?:(?:powered|driven)\s+by|model:?|provided\s+by)[\s\S]*$/i, "")
    .trim();
};

const getEnvKey = (name) => {
  let val = process.env[name] || "";
  val = val.trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  return val.trim();
};

const callGemini = async (messages, systemPrompt) => {
  const apiKey = getEnvKey("GEMINI_API_KEY");
  const primaryModel = getEnvKey("GEMINI_MODEL") || "gemini-3.5-flash";
  const modelCandidates = Array.from(new Set([primaryModel, "gemini-3.5-flash", "gemini-3-flash-preview", "gemini-3.8-flash", "gemini-3.5-flash-lite"]));

  for (const model of modelCandidates) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: messages.map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
          })),
          generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });

      if (!res.ok) {
        if (res.status === 404 || res.status === 503) continue;
        throw new Error(`gemini error ${res.status}`);
      }

      const data = await res.json();
      const candidate = data.candidates?.[0];
      if (candidate?.finishReason === "SAFETY" || data.promptFeedback?.blockReason) {
        const err = new Error("safety_blocked");
        err.isSafety = true;
        throw err;
      }
      const text = candidate?.content?.parts?.map((p) => p.text ?? "").join("").trim();
      if (text) return text;
    } catch (err) {
      if (err?.isSafety) throw err;
    }
  }

  throw new Error("gemini error");
};

const callGroq = async (messages, systemPrompt) => {
  const apiKey = getEnvKey("GROQ_API_KEY");
  const primaryModel = getEnvKey("GROQ_MODEL") || "llama-3.3-70b-versatile";
  const modelCandidates = Array.from(new Set([primaryModel, "qwen/qwen3.8-27b", "openai/gpt-oss-120b"]));

  for (const model of modelCandidates) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model,
          messages: [{ role: "system", content: systemPrompt }, ...messages],
          temperature: 0.4,
          max_completion_tokens: 1024,
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });

      if (!res.ok) {
        if (res.status === 404 || res.status === 400 || res.status === 503) continue;
        throw new Error(`groq error ${res.status}`);
      }

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content?.trim();
      if (text) return text;
    } catch (err) {
      if (err?.isSafety) throw err;
    }
  }

  throw new Error("groq error");
};

const providers = {
  gemini: { keyName: "GEMINI_API_KEY", call: callGemini },
  groq: { keyName: "GROQ_API_KEY", call: callGroq },
};

const providerOrder = () => {
  const primary = (getEnvKey("LLM_PROVIDER") || "gemini").toLowerCase();
  const order = primary === "groq" ? ["groq", "gemini"] : ["gemini", "groq"];
  return order.filter((name) => getEnvKey(providers[name].keyName));
};

export default async (req, context) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  if (!originAllowed(req)) return json({ error: "Forbidden" }, 403);

  const length = Number(req.headers.get("content-length") || 0);
  if (length > MAX_BODY_BYTES) return json({ error: "Message too large" }, 413);

  const ip = context?.ip || req.headers.get("x-nf-client-connection-ip") || "unknown";
  if (isRateLimited(ip)) return json({ error: "Too many messages. Please wait a minute and try again." }, 429);

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }

  const messages = sanitize(body?.messages);
  if (!messages) return json({ error: "Invalid messages" }, 400);

  const lastUserMsg = messages[messages.length - 1]?.content || "";
  if (ABUSE_REGEX.test(lastUserMsg)) {
    return json({ reply: FLAGGED_RESPONSE, flagged: true });
  }

  const names = providerOrder();
  if (!names.length) return json({ error: "The assistant is not configured yet. Please set GEMINI_API_KEY or GROQ_API_KEY." }, 503);

  const portfolio = await getPortfolioText();
  const systemPrompt = buildSystemPrompt(portfolio);

  for (const name of names) {
    try {
      const rawReply = await providers[name].call(messages, systemPrompt);
      const reply = stripBranding(rawReply);
      return json({ reply });
    } catch (err) {
      if (err?.isSafety) {
        return json({ reply: FLAGGED_RESPONSE, flagged: true });
      }
    }
  }

  return json({ error: TROUBLE_RESPONSE }, 502);
};
