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

const netlifyDevPlugin = () => ({
  name: 'netlify-dev',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const url = req.originalUrl || req.url || '';
      const match = url.match(/^\/\.netlify\/functions\/(chat|contact)(?:[/?].*)?$/);
      if (match && req.method === 'POST') {
        loadLocalEnv();
        let body = '';
        req.on('data', (chunk) => { body += chunk; });
        req.on('end', async () => {
          try {
            const fnName = match[1];
            const fnModule = await import(`./netlify/functions/${fnName}.mjs`);
            const handler = fnModule.default;
            const fakeReq = new Request(`http://localhost${url}`, {
              method: 'POST',
              headers: req.headers,
              body: body,
            });
            const response = await handler(fakeReq, { ip: req.socket?.remoteAddress || '127.0.0.1' });
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
    plugins: [tailwindcss(), netlifyDevPlugin()]
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