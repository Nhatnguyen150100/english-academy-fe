import { createBrowserRouter } from 'react-router-dom';
import App from '../pages/App';
import ErrorPage from '../pages/not-found';
import DEFINE_ROUTERS from '../constants/routers-mapper';
import LoginAdminPage from '../modules/admin/auth';
import AccountManager from '../modules/admin/account-manager/AccountManager';
import CourseManager from '../modules/admin/course-manager/CourseManager';
import CourseDetail from '../modules/admin/course-manager/CourseDetail';
import TheAdminLayout from '../modules/admin';
import BlogManager from '../modules/admin/blog-manager/BlogManager';
import NewCourse from '../modules/admin/course-manager/NewCourse';
import ExamDetail from '../modules/admin/course-manager/exam-manager/ExamDetail';
import NewExam from '../modules/admin/course-manager/exam-manager/NewExam';
import BlogDetail from '../modules/admin/blog-manager/BlogDetail';
import StatisticsManager from '../modules/admin/StatisticsManager';

const router = createBrowserRouter([
  {
    path: DEFINE_ROUTERS.home,
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: DEFINE_ROUTERS.admin,
    errorElement: <ErrorPage />,
    Component: TheAdminLayout,
    children: [
      {
        index: true,
        element: <StatisticsManager />,
      },
      {
        path: DEFINE_ROUTERS.accountManager,
        element: <AccountManager />,
      },
      {
        path: DEFINE_ROUTERS.blogManager,
        element: <BlogManager />,
      },
      {
        path: DEFINE_ROUTERS.blogDetail,
        element: <BlogDetail />,
      },
      {
        path: DEFINE_ROUTERS.courseManager,
        element: <CourseManager />,
      },
      {
        path: DEFINE_ROUTERS.newCourse,
        element: <NewCourse />,
      },
      {
        path: DEFINE_ROUTERS.courseDetail,
        element: <CourseDetail />,
      },
      {
        path: DEFINE_ROUTERS.examDetail,
        element: <ExamDetail />,
      },
      {
        path: DEFINE_ROUTERS.newExam,
        element: <NewExam />,
      },
    ],
  },
  {
    path: DEFINE_ROUTERS.loginAdmin,
    errorElement: <ErrorPage />,
    element: <LoginAdminPage />,
  },
]);

export default router;
