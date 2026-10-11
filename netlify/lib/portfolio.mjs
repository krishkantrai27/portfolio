let cacheText = "";
let lastFetchTime = 0;
const CACHE_TTL = 3600000;
const FETCH_TIMEOUT = 5000;

const cleanHtml = (html) => {
  if (!html) return "";
  let text = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, "")
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, "")
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, "");
  text = text.replace(/<[^>]+>/g, " ");
  text = text.replace(/\s+/g, " ").trim();
  return text;
};

const fetchPage = async (url) => {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT),
      headers: { "user-agent": "Mozilla/5.0 (Portfolio-AI-Bot)" },
    });
    if (!res.ok) return "";
    const html = await res.text();
    return cleanHtml(html);
  } catch {
    return "";
  }
};

export const getPortfolioText = async () => {
  const now = Date.now();
  if (cacheText && now - lastFetchTime < CACHE_TTL) {
    return cacheText;
  }
  const baseUrl = (process.env.SITE_URL || "https://krishkant.netlify.app/").replace(/\/+$/, "");
  const homeUrl = `${baseUrl}/`;
  const projectsUrl = `${baseUrl}/projects/`;

  const [homeText, projectsText] = await Promise.all([
    fetchPage(homeUrl),
    fetchPage(projectsUrl),
  ]);

  const combined = `${homeText} ${projectsText}`.trim().slice(0, 6000);
  if (combined) {
    cacheText = combined;
    lastFetchTime = now;
    return cacheText;
  }
  return cacheText || "";
};
