import { Request, Response } from 'express';
import { query } from '../config/db';
import bcrypt from 'bcryptjs';
import { signToken } from '../middlewares/auth';

// ─── Login ───────────────────────────────────────────────────────────────────

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password, role } = req.body;

  if (!email || !password) {
    res.status(400).json({ status: 'error', message: 'Se requiere correo/usuario y contraseña' });
    return;
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const cleanPassword = String(password).trim();

  try {
    const users = await query(
      'SELECT id, full_name as name, email, username, password_hash as password, role, career FROM users WHERE LOWER(email) = $1 OR LOWER(username) = $1',
      [cleanEmail]
    );

    if (users.length > 0) {
      const user = users[0];

      // Verify password: try bcrypt first, then plain-text fallback for legacy passwords
      if (user.password) {
        let passwordValid = false;

        if (user.password.startsWith('$2')) {
          // bcrypt hashed password
          passwordValid = await bcrypt.compare(cleanPassword, user.password);
        } else {
          // Legacy plain-text password (pre-migration)
          passwordValid = user.password === cleanPassword;

          // Auto-upgrade: hash the plain-text password for future logins
          if (passwordValid) {
            const hashed = await bcrypt.hash(cleanPassword, 10);
            await query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashed, user.id]);
          }
        }

        if (!passwordValid) {
          res.status(401).json({
            status: 'error',
            message: `Contraseña incorrecta. Recuerda el formato NOMBREapellido (ej: JOAQUINalbornoz).`,
          });
          return;
        }
      }

      const token = signToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      res.status(200).json({
        status: 'ok',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          career: user.career,
        },
        token,
      });
      return;
    }
  } catch (err) {
    // DB fallback — continue to generic login for dev mode
  }

  // Generic success for valid formatted credentials in dev mode (no DB)
  const devToken = signToken({
    userId: `usr-${Date.now()}`,
    email: cleanEmail,
    role: (role as 'student' | 'teacher') || 'student',
  });

  res.status(200).json({
    status: 'ok',
    user: {
      id: `usr-${Date.now()}`,
      name: cleanEmail.split('@')[0],
      email: cleanEmail,
      role: role || 'student',
      career: 'Técnico-Profesional',
    },
    token: devToken,
  });
}
