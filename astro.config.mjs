import { defineConfig, svgoOptimizer } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import preact from "@astrojs/preact";
import compress from "astro-compress";
import { readFileSync, existsSync } from 'node:fs';

const loadLocalEnv = () => {
  if (existsSync('./.env')) {
    const envContent = readFileSync('./.env', 'utf8');
    envContent.split('\n').forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let value = match[2] || '';
        value = value.trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        process.env[match[1]] = value;
      }
    });
  }
};

loadLocalEnv();

const netlifyChatDevPlugin = () => ({
  name: 'netlify-chat-dev',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const url = req.originalUrl || req.url || '';
      if (url.startsWith('/.netlify/functions/chat') && req.method === 'POST') {
        loadLocalEnv();
        let body = '';
        req.on('data', (chunk) => { body += chunk; });
        req.on('end', async () => {
          try {
            const chatModule = await import('./netlify/functions/chat.mjs');
            const handler = chatModule.default;
            const fakeReq = new Request(`http://localhost${url}`, {
              method: 'POST',
              headers: req.headers,
              body: body,
            });
            const response = await handler(fakeReq);
            res.statusCode = response.status;
            response.headers.forEach((val, key) => res.setHeader(key, val));
            const responseText = await response.text();
            res.end(responseText);
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('content-type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
        });
        return;
      }
      next();
    });
  },
});

export default defineConfig({
  site: 'https://krishkant.netlify.app',
  experimental: {
    svgOptimizer: svgoOptimizer()
  },
  integrations: [
    preact(),
    compress({
      CSS: true,
      HTML: true,
      JavaScript: true,
    })
  ],
  vite: {
    plugins: [tailwindcss(), netlifyChatDevPlugin()]
  },
  build: {
    cssCodeSplit: true,
    inlineStylesheets: 'auto',
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'styles/[name].[hash][extname]';
          }
          return '[name].[hash][extname]';
        }
      }
    }
  }
});