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
      'SELECT id, full_name as name, email, username, password_hash as password, role, career, avatar_url as avatar, xp, level FROM users WHERE LOWER(email) = $1 OR LOWER(username) = $1',
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
          avatar: user.avatar,
          xp: user.xp,
          level: user.level,
        },
        token,
      });
      return;
    } else {
      res.status(401).json({
        status: 'error',
        message: 'Usuario no encontrado.',
      });
      return;
    }
  } catch (err) {
    console.error('[login error]', err);
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    return;
  }
}

// ─── Update Profile ─────────────────────────────────────────────────────────

export async function updateProfile(req: Request, res: Response): Promise<void> {
  const user = (req as any).user as JwtPayload | undefined;

  if (!user) {
    res.status(401).json({ status: 'error', message: 'Autenticación requerida' });
    return;
  }

  const { avatar, xp, level } = req.body;

  try {
    // Build dynamic update query based on provided fields
    const updates = [];
    const values = [user.userId];
    let paramIdx = 2;

    if (avatar !== undefined) {
      updates.push(`avatar_url = $${paramIdx++}`);
      values.push(avatar);
    }
    if (xp !== undefined) {
      updates.push(`xp = $${paramIdx++}`);
      values.push(xp);
    }
    if (level !== undefined) {
      updates.push(`level = $${paramIdx++}`);
      values.push(level);
    }

    if (updates.length === 0) {
      res.status(400).json({ status: 'error', message: 'No hay campos para actualizar' });
      return;
    }

    await query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $1`,
      values
    );

    res.status(200).json({ status: 'ok', message: 'Perfil actualizado' });
  } catch (err: any) {
    console.error('[Profile] Error al actualizar:', err.message);
    res.status(500).json({ status: 'error', message: 'Error interno al actualizar perfil' });
  }
}
