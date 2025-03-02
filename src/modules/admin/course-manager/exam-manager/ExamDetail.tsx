import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IExamDetail } from '../../../../types/exam.types';
import { examService } from '../../../../services';
import Visibility from '../../../../components/base/visibility';
import { Button, Empty, Spin } from 'antd';
import ExamDetailSection from './ExamDetailSection';
import { ArrowLeftOutlined } from '@ant-design/icons';

export default function ExamDetail() {
  const navigate = useNavigate();
  const { examId } = useParams<{ examId: string }>();
  const [exam, setExam] = useState<IExamDetail>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleGetExamDetail = async () => {
    if (!examId) return;
    try {
      setLoading(true);
      const rs = await examService.getExamDetail(examId);
      setExam(rs.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetExamDetail();
  }, []);

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
        <h1 className="font-bold text-3xl">Exam Detail</h1>
        <Visibility
          visibility={Boolean(exam?._id)}
          suspenseComponent={loading ? <Spin /> : <Empty />}
        >
          <ExamDetailSection examProps={exam} />
        </Visibility>
      </div>
    </>
  );
}
