import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// ─── Config ──────────────────────────────────────────────────────────────────

const JWT_SECRET = process.env.JWT_SECRET || 'lectormat-dev-secret-2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface JwtPayload {
  userId: string;
  email: string;
  role: 'student' | 'teacher';
}

// ─── Token helpers ───────────────────────────────────────────────────────────

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload as object, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

// ─── Middleware ──────────────────────────────────────────────────────────────

/**
 * Validates the Bearer token and attaches `req.user` with the decoded payload.
 * Returns 401 if missing or invalid.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ status: 'error', message: 'Token de autenticación requerido' });
    return;
  }

  const token = authHeader.slice(7); // Remove "Bearer "

  try {
    const payload = verifyToken(token);
    (req as any).user = payload;
    next();
  } catch (err) {
    res.status(401).json({ status: 'error', message: 'Token inválido o expirado' });
  }
}

/**
 * Optional auth: if token present and valid, attaches req.user. Otherwise continues.
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    try {
      const payload = verifyToken(authHeader.slice(7));
      (req as any).user = payload;
    } catch {
      // Invalid token — continue without user
    }
  }

  next();
}
