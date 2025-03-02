import { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  notification,
  Spin,
  Table,
  TableProps,
  Tooltip,
} from 'antd';
import BaseSearch from '../../../components/base/BaseSearch';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { IBlogInfo, TStatusBlog } from '../../../types/blogs.types';
import { blogService } from '../../../services';

export default function BlogManager() {
  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    name: '',
    total: 0,
  });
  const [blogList, setBlogList] = useState<IBlogInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDeleteCourse = (_item: IBlogInfo) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this blog?',
      content: `Blog: ${_item.title}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const rs = await blogService.deleteBlog(_item._id);
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

  const handleChangeStatus = async (_item: IBlogInfo, status: TStatusBlog) => {
    Modal.confirm({
      title: `Are you sure you want to ${status} blog?`,
      content: `Blog: ${_item.title}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const rs = await blogService.updateStatusBlog(_item._id, status);
          notification.success({
            message: 'Success',
            description: rs.message,
          });
          handleGetCourseList();
        } catch (error) {
          notification.error({
            message: 'Error',
            description: 'Failed to update status.',
          });
        }
      },
    });
  };

  const columns: TableProps<IBlogInfo>['columns'] = [
    {
      title: 'Index',
      dataIndex: 'index',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      align: 'center',
      key: 'icon',
      render: (img) => <img className="h-[60px]" src={img} />,
    },
    {
      title: 'Name of course',
      dataIndex: 'title',
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
      title: 'Status blog',
      align: 'center',
      key: 'status',
      render: (_, item: IBlogInfo) => (
        <div className="flex items-center justify-center space-x-3 flex-row">
          <Tooltip title="Approve blog">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleChangeStatus(item, 'APPROVED');
              }}
              className="ms-3"
              variant="solid"
              color="green"
              shape="default"
              disabled={item.statusBlog === 'APPROVED'}
              icon={<CheckCircleOutlined />}
            >
              APPROVE
            </Button>
          </Tooltip>
          <Tooltip title="Reject blog">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleChangeStatus(item, 'REJECTED');
              }}
              className="ms-3"
              variant="solid"
              color="danger"
              shape="default"
              disabled={item.statusBlog === 'REJECTED'}
              icon={<CloseCircleOutlined />}
            >
              REJECT
            </Button>
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'Delete course',
      key: 'deleteExam',
      render: (_, exam: IBlogInfo) => (
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
      const rs = await blogService.getAllBlogs(query);
      setBlogList(rs.data.data);
      setQuery((pre) => ({
        ...pre,
        total: rs.data.total,
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetCourseList();
  }, [query.page]);

  const handleClickRow = (_item: IBlogInfo) => {
    navigate(`/admin/blogs-manager/${_item._id}`);
  };

  return (
    <div className="flex flex-col justify-start items-center space-y-5">
      <h1 className="font-bold text-3xl">Blogs Manager</h1>
      <div className="flex flex-row justify-between items-center w-full">
        <BaseSearch
          value={query.name!}
          placeholder="Input search text"
          onHandleChange={(value) => {
            setQuery({ ...query, name: value });
          }}
          onSearch={() => handleGetCourseList()}
        />
      </div>
      {loading ? (
        <Spin />
      ) : (
        <div className="w-full">
          <Table<IBlogInfo>
            rowKey="id"
            className="cursor-pointer"
            columns={columns}
            onRow={(record) => ({
              onClick: () => handleClickRow(record),
            })}
            dataSource={blogList}
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
