const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 3;
const MAX_BODY_BYTES = 10000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

const getEnvKey = (name) => {
  let val = process.env[name] || "";
  val = val.trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  return val.trim();
};

export default async (req, context) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  if (!originAllowed(req)) return json({ error: "Forbidden" }, 403);

  const length = Number(req.headers.get("content-length") || 0);
  if (length > MAX_BODY_BYTES) return json({ error: "Request too large" }, 413);

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }

  const website = body?.website ? String(body.website).trim() : "";
  if (website) {
    return json({ message: "Message sent. I'll reply soon." }, 200);
  }

  const ip = context?.ip || req.headers.get("x-nf-client-connection-ip") || "unknown";
  if (isRateLimited(ip)) {
    return json({ error: "Too many requests. Please try again later." }, 429);
  }

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (name.length < 2 || name.length > 80) {
    return json({ error: "Invalid form input." }, 400);
  }

  if (!email || email.length > 320 || !EMAIL_REGEX.test(email)) {
    return json({ error: "Invalid form input." }, 400);
  }

  if (message.length < 10 || message.length > 2000) {
    return json({ error: "Invalid form input." }, 400);
  }

  const apiKey = getEnvKey("RESEND_API_KEY");
  const toEmail = getEnvKey("CONTACT_TO_EMAIL");
  const fromEmail = getEnvKey("CONTACT_FROM_EMAIL");

  if (!apiKey || !toEmail || !fromEmail) {
    return json({ error: "Unable to send message right now. Please try again later." }, 500);
  }

  const toList = toEmail.split(",").map((e) => e.trim()).filter(Boolean);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: toList,
        reply_to: email,
        subject: `Portfolio message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return json({ error: "Unable to send message right now. Please try again later." }, 502);
    }

    return json({ message: "Message sent. I'll reply soon." }, 200);
  } catch {
    return json({ error: "Unable to send message right now. Please try again later." }, 500);
  }
};
