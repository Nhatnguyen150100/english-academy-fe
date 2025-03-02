import React, { useEffect, useState } from 'react';
import { useNavigate, useNavigation, useParams } from 'react-router-dom';
import { ICourse } from '../../../types/course.type';
import { courseService } from '../../../services';
import Visibility from '../../../components/base/visibility';
import { Button, message, Spin, Tabs, TabsProps } from 'antd';
import CourseSection from './common/CourseSection';
import ExamManager from './exam-manager/ExamManager';
import { ArrowLeftOutlined } from '@ant-design/icons';

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<ICourse>();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleGetCourseDetail = async () => {
    if (!courseId) return;
    try {
      setLoading(true);
      const rs = await courseService.getCourseDetail(courseId);
      setCourse(rs.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetCourseDetail();
  }, []);

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      setLoading(true);
      const rs = await courseService.updateCourse(courseId!, data);
      message.success(rs.message);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Course info',
      children: (
        <Visibility
          visibility={Boolean(course)}
          suspenseComponent={<Spin spinning={loading} />}
        >
          <CourseSection item={course} handleSubmit={handleSubmit} />
        </Visibility>
      ),
    },
    {
      key: '2',
      label: 'List Exam',
      children: (
        <Visibility
          visibility={Boolean(course)}
          suspenseComponent={<Spin spinning={loading} />}
        >
          <ExamManager courseId={courseId!} />
        </Visibility>
      ),
    },
  ];

  return (
    <>
      <Button
        className="min-w-[220px]"
        icon={<ArrowLeftOutlined />}
        onClick={() => {
          navigate(-1);
        }}
      >
        Back
      </Button>
      <Tabs defaultActiveKey="1" items={items} />
    </>
  );
}
