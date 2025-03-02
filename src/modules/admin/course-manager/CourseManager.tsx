import { useEffect, useState } from 'react';
import { courseService, examService } from '../../../services';
import {
  Button,
  Modal,
  notification,
  Spin,
  Table,
  TableProps,
} from 'antd';
import BaseSearch from '../../../components/base/BaseSearch';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import DEFINE_ROUTERS from '../../../constants/routers-mapper';
import { ICourse } from '../../../types/course.type';

export default function CourseManager() {
  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    name: '',
    total: 0
  });
  const [courseList, setCourseList] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDeleteCourse = (_item: ICourse) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this course?',
      content: `Course: ${_item.name}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const rs = await examService.deleteExam(_item._id);
          notification.success({
            message: 'Success',
            description: rs.message,
          });
          handleGetCourseList();
        } catch (error) {
          notification.error({
            message: 'Error',
            description: 'Failed to delete exam.',
          });
        }
      },
    });
  };

  const columns: TableProps<ICourse>['columns'] = [
    {
      title: 'Index',
      dataIndex: 'index',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Name of course',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className="text-xl font-semibold">{text}</span>,
    },
    {
      title: 'Description',
      key: 'description',
      dataIndex: 'description',
      render: (text) => <span className="font-normal">{text}</span>,
    },
    {
      title: 'Delete course',
      key: 'deleteExam',
      render: (_, exam: ICourse) => (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteCourse(exam);
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

  const handleGetCourseList = async () => {
    try {
      setLoading(true);
      const rs = await courseService.getAllCourse(query);
      setCourseList(rs.data.data);
      setQuery((pre) => ({
        ...pre,
        total: rs.data.total,
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleClickRow = (item: ICourse) => {
    navigate(`/admin/course-manager/${item._id}`);
  };

  useEffect(() => {
    handleGetCourseList();
  }, [query.page]);

  return (
    <div className="flex flex-col justify-start items-center space-y-5">
      <h1 className="font-bold text-3xl">Courses Manager</h1>
      <div className="flex flex-row justify-between items-center w-full">
        <BaseSearch
          value={query.name!}
          placeholder="Input search text"
          onHandleChange={(value) => {
            setQuery({ ...query, name: value });
          }}
          onSearch={() => handleGetCourseList()}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          iconPosition="start"
          onClick={() => {
            navigate(DEFINE_ROUTERS.newCourse);
          }}
        >
          Add new course
        </Button>
      </div>
      {loading ? (
        <Spin />
      ) : (
        <div className="w-full">
          <Table<ICourse>
            rowKey="id"
            columns={columns}
            dataSource={courseList}
            className='cursor-pointer'
            onRow={(record) => ({
              onClick: () => handleClickRow(record),
            })}
            pagination={{
              current: query.page,
              pageSize: query.limit,
              total: query.total ?? 0,
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
