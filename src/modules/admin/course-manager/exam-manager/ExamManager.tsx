import { useEffect, useState } from 'react';

import { Button, Modal, notification, Spin, Table, TableProps } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { IExam } from '../../../../types/exam.types';
import { examService } from '../../../../services';
import { onChooseLevel } from '../../../../utils/functions/on-choose-level-kanji';
import { formatDate } from '../../../../utils/functions/format-date';
import DEFINE_ROUTERS from '../../../../constants/routers-mapper';

interface IProps {
  courseId: string;
}

export default function ExamManager({ courseId }: IProps) {
  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    name: '',
    total: 0,
  });
  const [examList, setExamList] = useState<IExam[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDeleteExam = (exam: IExam) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this exam?',
      content: `Exam: ${exam.name}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const rs = await examService.deleteExam(exam._id);
          notification.success({
            message: 'Success',
            description: rs.message,
          });
          handleGetExamList();
        } catch (error) {
          notification.error({
            message: 'Error',
            description: 'Failed to delete exam.',
          });
        }
      },
    });
  };

  const columns: TableProps<IExam>['columns'] = [
    {
      title: 'Index',
      dataIndex: 'index',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Name Exam',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className="text-xl font-semibold">{text}</span>,
    },
    {
      title: 'Level of exam',
      key: 'level',
      dataIndex: 'level',
      render: (level) => onChooseLevel(level),
    },
    {
      title: 'Time finish',
      key: 'timeFinish',
      dataIndex: 'timeExam',
      render: (text) => <span className="font-semibold">{text} minutes</span>,
    },
    {
      title: 'Description',
      key: 'description',
      dataIndex: 'description',
      render: (text) => <span className="font-normal">{text} minutes</span>,
    },
    {
      title: 'Created date',
      key: 'createdAt',
      dataIndex: 'createdAt',
      render: (createdAt) => <span>{formatDate(createdAt)}</span>,
    },
    {
      title: 'Delete exam',
      key: 'deleteExam',
      render: (_, exam: IExam) => (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteExam(exam);
          }}
          className="ms-3"
          variant="solid"
          color="danger"
          shape="default"
          icon={<DeleteOutlined />}
        />
      ),
    },
  ];

  const handleGetExamList = async () => {
    try {
      setLoading(true);
      const rs = await examService.getExamList(courseId, query);
      console.log('🚀 ~ handleGetExamList ~ rs:', rs);
      setExamList(rs.data.data);
      setQuery((pre) => ({
        ...pre,
        total: rs.data.total,
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleClickRow = (exam: IExam) => {
    navigate(
      `/admin/course-manager/exam-manager/${exam._id}?courseId=${courseId}`,
    );
  };

  useEffect(() => {
    handleGetExamList();
  }, [query.page]);

  return (
    <div className="flex flex-col justify-start items-center space-y-5">
      <h1 className="font-bold text-3xl">Exam Manager</h1>
      <div className="flex flex-row justify-between items-center w-full">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          iconPosition="start"
          onClick={() => {
            navigate(DEFINE_ROUTERS.newExam.replace(':courseId', courseId));
          }}
        >
          Add new exam
        </Button>
      </div>
      {loading ? (
        <Spin />
      ) : (
        <div className="w-full">
          <Table<IExam>
            rowKey="id"
            className="cursor-pointer"
            columns={columns}
            dataSource={examList}
            onRow={(record) => ({
              onClick: () => handleClickRow(record),
            })}
            pagination={{
              current: query.page,
              pageSize: query.limit,
              total: query.total,
              onChange: (page, limit) => {
                setQuery((pre) => ({
                  ...pre,
                  page,
                  limit,
                }));
              },
            }}
          />
        </div>
      )}
    </div>
  );
}
