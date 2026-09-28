import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { handleGenerate, handleHealth } from './handlers.js';

dotenv.config();

const PORT = process.env.PORT || 3001;

export function createApp(options = {}) {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (req, res) => handleHealth(req, res));
  app.all('/api/health', (_req, res) => res.set('Allow', 'GET').status(405).json({ error: 'Method not allowed.' }));
  app.post('/api/generate', (req, res) => handleGenerate(req, res, options));
  app.all('/api/generate', (_req, res) => res.set('Allow', 'POST').status(405).json({ error: 'Method not allowed.' }));

  return app;
}

const isMainModule = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isMainModule) {
  createApp().listen(PORT, () => {
    console.log(`Flam Study Assistant local API listening on port ${PORT}`);
  });
}
