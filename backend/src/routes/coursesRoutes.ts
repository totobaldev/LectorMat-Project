import { Router } from 'express';
import {
  listCourses,
  listEnrolledCourses,
  createCourse,
  createSection,
  deleteSection,
  importSectionRoster,
  getSectionStudents,
  createUnit,
} from '../controllers/coursesController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.get('/', listCourses);
router.get('/enrolled', authMiddleware, listEnrolledCourses);
router.post('/', createCourse);
router.post('/:courseId/sections', createSection);
router.delete('/:courseId/sections/:sectionId', deleteSection);
router.post('/:courseId/sections/:sectionId/roster', importSectionRoster);
router.get('/:courseId/sections/:sectionId/students', getSectionStudents);
router.post('/:courseId/sections/:sectionId/units', createUnit);

export default router;

