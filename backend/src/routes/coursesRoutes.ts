import { Router } from 'express';
import {
  listCourses,
  createCourse,
  createSection,
  importSectionRoster,
  getSectionStudents,
} from '../controllers/coursesController';

const router = Router();

router.get('/', listCourses);
router.post('/', createCourse);
router.post('/:courseId/sections', createSection);
router.post('/:courseId/sections/:sectionId/roster', importSectionRoster);
router.get('/:courseId/sections/:sectionId/students', getSectionStudents);

export default router;
