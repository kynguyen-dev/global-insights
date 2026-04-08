import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Plugin to scrape real petrol data from webgia.com (bypasses Cloudflare/CORS)
const petrolScraperPlugin = () => ({
  name: 'petrol-scraper-plugin',
  configureServer(server: any) {
    server.middlewares.use(async (req: any, res: any, next: any) => {
      if (req.url && req.url.startsWith('/api/proxy-petrol')) {
        try {
          const response = await fetch('https://webgia.com/gia-xang-dau/petrolimex/', {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36' }
          });
          const html = await response.text();

          // Product definitions in the order they appear on webgia
          const products = [
            { id: 'ron95v',   name: 'Xăng RON 95-V',    icon: '⛽' },
            { id: 'ron95iii', name: 'Xăng RON 95-III',   icon: '⛽' },
            { id: 'e5ron92',  name: 'Xăng E5 RON 92-II', icon: '⛽' },
            { id: 'do001sv',  name: 'DO 0,001S-V',       icon: '🛢️' },
            { id: 'do005s',   name: 'DO 0,05S-II',       icon: '🛢️' },
            { id: 'dauhoa',   name: 'Dầu hỏa 2-K',      icon: '🛢️' },
          ];

          // Extract all <td> price values (format: 25.550)
          const tdMatches = [...html.matchAll(/<td[^>]*>\s*([\d]{2,3}\.[\d]{3})\s*<\/td>/gi)];
          const allPrices = tdMatches.map(m => parseInt(m[1].replace(/\./g, '')));

          // Prices come in pairs: [zone1, zone2] for each product
          const items = products.map((p, i) => ({
            ...p,
            priceZone1: allPrices[i * 2] || 0,
            priceZone2: allPrices[i * 2 + 1] || 0,
          }));

          // Extract update timestamp from page
          const timeMatch = html.match(/cập nhật.*?(\d{1,2}:\d{2}:\d{2}\s+\d{2}\/\d{2}\/\d{4})/i);
          const updatedAt = timeMatch ? timeMatch[1] : new Date().toISOString();

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            status: 'ok',
            data: {
              items,
              updatedAt,
              // Keep backward-compatible single price for dashboard widget
              price: items[0]?.priceZone1 || 25550,
              percentChange: 0,
            }
          }));
          return;
        } catch (e) {
          console.error('[PetrolScraper] Error fetching data', e);
          res.statusCode = 500;
          res.end(JSON.stringify({ status: 'error', message: 'Failed to fetch' }));
          return;
        }
      }
      next();
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    petrolScraperPlugin(),
  ],
  server: {
    proxy: {
      // Proxy gold price API to bypass CORS in development
      // vang.today actual endpoint: /api/prices.php
      '/api/gold': {
        target: 'https://www.vang.today',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/gold/, '/api/prices.php'),
      },
      // Original pricedancing proxy (kept for reference, though bypassed)
      '/api/petrol': {
        target: 'https://www.pricedancing.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/petrol/, '/api'),
      },
    },
  },
})

