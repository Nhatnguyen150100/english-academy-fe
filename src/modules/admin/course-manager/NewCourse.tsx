import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import CourseSection from './common/CourseSection';
import { courseService } from '../../../services';

export default function NewCourse() {
  const navigate = useNavigate();

  const handleSubmit = async (data: Record<string, any>) => {
    const rs = await courseService.createCourse(data);
    message.success(rs.message);
    navigate(-1);
  };

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
      <div className="flex w-full flex-col justify-center items-center space-y-5">
        <h1 className="font-bold text-3xl">Create new course</h1>
        <CourseSection handleSubmit={handleSubmit} />
      </div>
    </>
  );
}
