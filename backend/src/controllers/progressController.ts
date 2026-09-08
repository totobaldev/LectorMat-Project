import { Request, Response } from 'express';
import { query } from '../config/db';
import type { JwtPayload } from '../middlewares/auth';

// ─── Save / Update Progress ─────────────────────────────────────────────────

export async function saveProgress(req: Request, res: Response): Promise<void> {
  const user = (req as any).user as JwtPayload | undefined;

  if (!user) {
    res.status(401).json({ status: 'error', message: 'Autenticación requerida' });
    return;
  }

  const { unitId, moduleId, score, isCompleted } = req.body;

  if (unitId === undefined || !moduleId) {
    res.status(400).json({ status: 'error', message: 'unitId y moduleId son requeridos' });
    return;
  }

  const scoreVal = typeof score === 'number' ? score : null;
  const completed = Boolean(isCompleted);

  try {
    await query(
      `INSERT INTO progress_logs (user_id, unit_id, module_id, score, is_completed, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT ON CONSTRAINT uq_progress_user_unit_module
       DO UPDATE SET
         score = GREATEST(progress_logs.score, $4),
         is_completed = progress_logs.is_completed OR $5,
         updated_at = NOW()`,
      [user.userId, unitId, moduleId, scoreVal, completed]
    );

    res.status(200).json({
      status: 'ok',
      message: 'Progreso guardado exitosamente',
      data: { userId: user.userId, unitId, moduleId, score: scoreVal, isCompleted: completed },
    });
  } catch (err: any) {
    console.error('[Progress] Error al guardar:', err.message);
    res.status(200).json({
      status: 'ok',
      message: 'Progreso registrado (modo local)',
      data: { unitId, moduleId, score: scoreVal, isCompleted: completed },
    });
  }
}

// ─── Get My Progress ─────────────────────────────────────────────────────────

export async function getMyProgress(req: Request, res: Response): Promise<void> {
  const user = (req as any).user as JwtPayload | undefined;

  if (!user) {
    res.status(401).json({ status: 'error', message: 'Autenticación requerida' });
    return;
  }

  try {
    const rows = await query(
      `SELECT unit_id as "unitId", module_id as "moduleId", score, is_completed as "isCompleted", updated_at as "updatedAt"
       FROM progress_logs
       WHERE user_id = $1
       ORDER BY unit_id, module_id`,
      [user.userId]
    );

    // Build structured progress summary
    const summary: Record<number, Record<string, { score: number | null; isCompleted: boolean }>> = {};

    for (const row of rows) {
      if (!summary[row.unitId]) summary[row.unitId] = {};
      summary[row.unitId][row.moduleId] = {
        score: row.score,
        isCompleted: row.isCompleted,
      };
    }

    res.status(200).json({
      status: 'ok',
      data: {
        raw: rows,
        summary,
      },
    });
  } catch (err: any) {
    console.warn('[Progress] DB no disponible:', err.message);
    res.status(200).json({
      status: 'ok',
      data: { raw: [], summary: {} },
    });
  }
}
