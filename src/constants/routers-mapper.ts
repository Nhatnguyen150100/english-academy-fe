const DEFINE_ROUTERS = {
  home: '/',
  admin: '/admin',
  loginAdmin: '/admin/auth/login',
  accountManager: '/admin/account-manager',

  blogManager: '/admin/blogs-manager',
  blogDetail: '/admin/blogs-manager/:blogId',

  courseManager: '/admin/course-manager',
  newCourse: '/admin/course-manager/new-course',
  courseDetail: '/admin/course-manager/:courseId',

  examDetail: '/admin/course-manager/exam-manager/:examId',
  newExam: '/admin/course-manager/exam-manager/new-exam/:chapterId',
};

export default DEFINE_ROUTERS;
