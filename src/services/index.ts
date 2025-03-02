import AuthService from './authService';
import CourseService from './courseService';
import ExamService from './examService';
import TestService from './testService';

export const authService = new AuthService();
export const examService = new ExamService();
export const testService = new TestService();
export const courseService = new CourseService();
