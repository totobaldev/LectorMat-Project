import 'dotenv/config';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';

// ─── App Setup ───────────────────────────────────────────────────────────────

const app: Application = express();
const PORT = process.env.PORT ?? 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:5173';

// ─── Global Middlewares ───────────────────────────────────────────────────────

app.use(
  cors({
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

import coursesRouter from './routes/coursesRoutes';
import authRouter from './routes/authRoutes';
import progressRouter from './routes/progressRoutes';

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'lectormat-api',
    environment: process.env.NODE_ENV ?? 'development',
    timestamp: new Date().toISOString(),
  });
});

// Feature routers
app.use('/api/courses', coursesRouter);
app.use('/api/auth', authRouter);
app.use('/api/progress', progressRouter);

// ─── 404 Handler ─────────────────────────────────────────────────────────────

app.use((_req: Request, res: Response) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(`[ERROR] ${err.message}`, err.stack);
  res.status(500).json({
    status: 'error',
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
  });
});

import { initDatabase } from './config/db';

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, async () => {
  await initDatabase();
  console.log(
    `\n🟢 LectorMat API running\n   → http://localhost:${PORT}/api/health\n   → ENV: ${process.env.NODE_ENV}\n`
  );
});

export default app;
