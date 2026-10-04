// Smart Community Intelligence Platform (SCIP) - Full Stack Server
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './src/server/routes/authRoutes.ts';
import reportRoutes from './src/server/routes/reportRoutes.ts';
import incidentRoutes from './src/server/routes/incidentRoutes.ts';
import intelligenceRoutes from './src/server/routes/intelligenceRoutes.ts';
import adminRoutes from './src/server/routes/adminRoutes.ts';
import miscRoutes from './src/server/routes/miscRoutes.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();

  // Security Headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // REST API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/reports', reportRoutes);
  app.use('/api/incidents', incidentRoutes);
  app.use('/api/intelligence', intelligenceRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api', miscRoutes);

  // Development: Vite Middleware Mode; Production: Static dist
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (viteErr) {
      console.error('[SCIP] Vite middleware init warning:', viteErr);
    }
  }

  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SCIP] Smart Community Intelligence Platform server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
