import { Request, Response } from 'express';
import { query } from '../config/db';
import { generateStudentPassword, parseNameParts } from '../utils/credentials';

export interface RosterStudentInput {
  name: string;
  email: string;
  career?: string;
}

// In-memory fallback storage when DB is unseeded/offline
const memoryCourses: Array<{
  id: string;
  name: string;
  description: string;
  sections: Array<{
    id: string;
    title: string;
    order: number;
    students: Array<{
      id: string;
      name: string;
      email: string;
      username: string;
      password: string;
      career: string;
      dateEnrolled: string;
    }>;
  }>;
}> = [
  {
    id: 'tc1',
    name: 'Trigonometria',
    description: 'Curso de trigonometría básica y aplicaciones en geometría.',
    sections: [
      { id: 'c1', title: 'C1', order: 1, students: [] },
      { id: 'c4', title: 'C4', order: 2, students: [] },
    ],
  },
];

export async function listEnrolledCourses(req: Request, res: Response): Promise<void> {
  // req.user is injected by requireAuth middleware
  const userId = (req as any).user?.userId;

  if (!userId) {
    res.status(401).json({ status: 'error', message: 'No autenticado' });
    return;
  }

  try {
    // Find courses/sections where this user is enrolled
    const rows = await query(
      `SELECT
         c.id        AS course_id,
         c.name      AS course_name,
         c.description,
         cs.id       AS section_id,
         cs.title    AS section_title,
         cu.id       AS unit_id,
         cu.title    AS unit_title,
         cu.subtitle AS unit_subtitle,
         cu.unit_order
       FROM section_students ss
       JOIN courses c         ON c.id  = ss.course_id
       JOIN course_sections cs ON cs.id = ss.section_id
       LEFT JOIN course_units cu ON cu.section_id = cs.id
       WHERE ss.user_id = $1
       ORDER BY c.id, cs.section_order, cu.unit_order`,
      [userId]
    );

    if (rows.length === 0) {
      // Student authenticated but no enrollments found — return empty list
      res.status(200).json({ status: 'ok', data: [] });
      return;
    }

    // Group rows into course → section → units
    const courseMap: Record<string, any> = {};
    for (const row of rows) {
      if (!courseMap[row.course_id]) {
        courseMap[row.course_id] = {
          id: row.course_id,
          name: row.course_name,
          description: row.description,
          sections: {},
        };
      }
      const course = courseMap[row.course_id];
      if (!course.sections[row.section_id]) {
        course.sections[row.section_id] = {
          id: row.section_id,
          title: row.section_title,
          units: [],
        };
      }
      if (row.unit_id) {
        const section = course.sections[row.section_id];
        const alreadyAdded = section.units.some((u: any) => u.id === row.unit_id);
        if (!alreadyAdded) {
          section.units.push({
            id: row.unit_id,
            title: row.unit_title,
            subtitle: row.unit_subtitle,
            order: row.unit_order,
            modules: { comprension: [], metodo: [], interactivo: [] },
          });
        }
      }
    }

    // Flatten to array
    const result = Object.values(courseMap).map((c: any) => ({
      ...c,
      sections: Object.values(c.sections),
    }));

    res.status(200).json({ status: 'ok', data: result });
  } catch (err) {
    // DB unavailable — return empty so frontend falls back to default curriculum
    console.warn('[listEnrolledCourses] DB error, falling back:', err);
    res.status(200).json({ status: 'ok', data: [] });
  }
}

export async function listCourses(_req: Request, res: Response): Promise<void> {
  try {
    const dbCourses = await query('SELECT * FROM courses ORDER BY created_at DESC');
    if (dbCourses.length > 0) {
      res.status(200).json({ status: 'ok', data: dbCourses });
      return;
    }
  } catch (err) {
    // Fallback to memory state
  }

  res.status(200).json({ status: 'ok', data: memoryCourses });
}

export async function createCourse(req: Request, res: Response): Promise<void> {
  const { name, description } = req.body;
  if (!name) {
    res.status(400).json({ status: 'error', message: 'El nombre del curso es obligatorio' });
    return;
  }

  const id = `course-${Date.now()}`;
  const newCourse = {
    id,
    name,
    description: description || '',
    sections: [], // Secciones se crean manualmente por el docente
  };

  memoryCourses.push(newCourse);

  try {
    await query('INSERT INTO courses (id, name, description) VALUES ($1, $2, $3)', [
      id,
      name,
      description,
    ]);
  } catch (err) {
    // DB fallback
  }

  res.status(201).json({ status: 'ok', data: newCourse });
}

export async function createSection(req: Request, res: Response): Promise<void> {
  const { courseId } = req.params;
  const { title } = req.body;

  const course = memoryCourses.find((c) => c.id === courseId);
  const sectionId = `sec-${Date.now()}`;
  const order = (course?.sections.length ?? 0) + 1;
  const sectionTitle = title || `C${order}`;

  const newSection = { id: sectionId, title: sectionTitle, order, students: [] };

  if (course) {
    course.sections.push(newSection);
  }

  try {
    await query(
      'INSERT INTO course_sections (id, course_id, title, section_order) VALUES ($1, $2, $3, $4)',
      [sectionId, courseId, sectionTitle, order]
    );
  } catch (err) {
    // DB fallback
  }

  res.status(201).json({ status: 'ok', data: newSection });
}

export async function deleteSection(req: Request, res: Response): Promise<void> {
  const { courseId, sectionId } = req.params;

  const course = memoryCourses.find((c) => c.id === courseId);
  if (course) {
    course.sections = course.sections.filter((s) => s.id !== sectionId);
  }

  try {
    await query(
      'DELETE FROM course_sections WHERE id = $1 AND course_id = $2',
      [sectionId, courseId]
    );
  } catch (err) {
    // DB fallback
  }

  res.status(200).json({ status: 'ok', message: 'Sección eliminada exitosamente' });
}


export async function createUnit(req: Request, res: Response): Promise<void> {
  const { courseId, sectionId } = req.params;
  const { title, subtitle } = req.body;

  const unitId = `unit-${Date.now()}`;
  const order = 1; // Simplification for mock

  try {
    await query(
      'INSERT INTO course_units (id, section_id, title, subtitle, unit_order) VALUES ($1, $2, $3, $4, $5)',
      [unitId, sectionId, title, subtitle, order]
    );
  } catch (err) {
    // DB fallback
  }

  res.status(201).json({ status: 'ok', data: { id: unitId, title, subtitle, order } });
}

export async function importSectionRoster(req: Request, res: Response): Promise<void> {
  const { courseId, sectionId } = req.params;
  const { students } = req.body as { students: RosterStudentInput[] };

  if (!students || !Array.isArray(students) || students.length === 0) {
    res.status(400).json({ status: 'error', message: 'Se requiere una lista de estudiantes válida' });
    return;
  }

  const course = memoryCourses.find((c) => c.id === courseId);
  const section = course?.sections.find((s) => s.id === sectionId);

  const importedList = students.map((std) => {
    const { firstName, lastName } = parseNameParts(std.name);
    const password = generateStudentPassword(firstName, lastName);
    const email = std.email.toLowerCase().trim();

    return {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: std.name.trim(),
      email,
      username: email,
      password,
      career: std.career || 'Técnico-Profesional',
      dateEnrolled: new Date().toISOString(),
    };
  });

  if (section) {
    // Filter existing duplicates by email
    const existingEmails = new Set(section.students.map((s) => s.email));
    const newItems = importedList.filter((s) => !existingEmails.has(s.email));
    section.students.push(...newItems);
  }

  // Persist to PostgreSQL if DB is available
  for (const std of importedList) {
    try {
      await query(
        `INSERT INTO users (id, full_name, email, username, password_hash, role, career)
         VALUES ($1, $2, $3, $4, $5, 'student', $6)
         ON CONFLICT (email) DO UPDATE SET password_hash = $5`,
        [std.id, std.name, std.email, std.username, std.password, std.career]
      );

      await query(
        `INSERT INTO section_students (course_id, section_id, user_id, generated_password)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (section_id, user_id) DO NOTHING`,
        [courseId, sectionId, std.id, std.password]
      );
    } catch (err) {
      // DB fallback
    }
  }

  res.status(200).json({
    status: 'ok',
    message: `Se importaron ${importedList.length} estudiantes exitosamente`,
    data: {
      courseId,
      sectionId,
      students: importedList,
    },
  });
}

export async function getSectionStudents(req: Request, res: Response): Promise<void> {
  const { courseId, sectionId } = req.params;

  const course = memoryCourses.find((c) => c.id === courseId);
  const section = course?.sections.find((s) => s.id === sectionId);

  if (section) {
    res.status(200).json({ status: 'ok', data: section.students });
    return;
  }

  try {
    const rows = await query(
      `SELECT u.id, u.full_name as name, u.email, u.username, ss.generated_password as password, u.career, ss.created_at as "dateEnrolled"
       FROM section_students ss
       JOIN users u ON ss.user_id = u.id
       WHERE ss.course_id = $1 AND ss.section_id = $2`,
      [courseId, sectionId]
    );

    res.status(200).json({ status: 'ok', data: rows });
  } catch (err) {
    res.status(200).json({ status: 'ok', data: [] });
  }
}
