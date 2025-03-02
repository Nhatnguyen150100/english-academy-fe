import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import ExamDetailSection from './ExamDetailSection';

export default function NewExam() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
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
        <h1 className="font-bold text-3xl">Create new exam</h1>
        {courseId && <ExamDetailSection courseId={courseId} />}
      </div>
    </>
  );
}
