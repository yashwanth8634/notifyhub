import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

import { requestLogger } from '../Backend/src/middlewares/requestLogger.js';
import { errorHandler } from '../Backend/src/middlewares/errorHandler.js';
import apiRoutes from '../Backend/src/routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security and utility middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// API Routes
app.use('/api', apiRoutes);

// Serve frontend static files in production
const publicDir = path.join(__dirname, '../public');
app.use(express.static(publicDir));

// SPA fallback — serve index.html for any non-API route
app.use((req, res, next) => {
  // Only fall back for GET requests that don't start with /api
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    res.sendFile(path.join(publicDir, 'index.html'));
  } else {
    next();
  }
});

// Centralized error handler
app.use(errorHandler);

export default app;
