import { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Modal,
  notification,
  Spin,
  Table,
  TableProps,
  Tag,
  Tooltip,
} from 'antd';
import BaseSearch from '../../../components/base/BaseSearch';
import { CheckCircleOutlined } from '@ant-design/icons';
import { authService } from '../../../services';
import { IUser } from '../../../types/user.types';

export default function AccountManager() {
  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    name: '',
    total: 0,
    isRequestChangeToPremium: false,
  });
  const [userList, setListUser] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChangeStatus = async (
    _item: IUser,
    status: 'FREE' | 'PREMIUM',
  ) => {
    Modal.confirm({
      title: `Are you sure you want to change account to ${status}?`,
      content: `Account: ${_item.email}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const rs = await authService.updateAccountType(_item._id, status);
          notification.success({
            message: 'Success',
            description: rs.message,
          });
          handleGetListUser();
        } catch (error) {
          notification.error({
            message: 'Error',
            description: 'Failed to update status.',
          });
        }
      },
    });
  };

  const columns: TableProps<IUser>['columns'] = [
    {
      title: 'Index',
      dataIndex: 'index',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => <span className="text-xl font-semibold">{text}</span>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'email',
      render: (text) => <span className="text-xl font-semibold">{text}</span>,
    },
    {
      title: 'Phone number',
      dataIndex: 'phone_number',
      key: 'phone',
      render: (text) => <span className="text-xl font-semibold">{text}</span>,
    },
    {
      title: 'Address',
      key: 'address',
      dataIndex: 'address',
      render: (text) => <span className="font-normal">{text}</span>,
    },
    {
      title: 'Account type',
      key: 'accountType',
      dataIndex: 'accountType',
      render: (text) => (
        <Tag
          className="px-3 py-1"
          color={text === 'PREMIUM' ? 'orange' : 'green'}
        >
          {text}
        </Tag>
      ),
    },
    {
      title: 'Request from user',
      key: 'isRequestChangeToPremium',
      dataIndex: 'isRequestChangeToPremium',
      render: (isChange) => {
        if (isChange) return <Tag color="geekblue">Request to premium</Tag>;
        return null;
      },
    },
    {
      title: 'Action',
      align: 'center',
      key: 'status',
      render: (_, item: IUser) => (
        <Tooltip
          title={`Change account type to ${
            item.accountType === 'FREE' ? 'PREMIUM' : 'FREE'
          }`}
        >
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleChangeStatus(
                item,
                item.accountType === 'FREE' ? 'PREMIUM' : 'FREE',
              );
            }}
            className="ms-3"
            variant="solid"
            color={item.accountType === 'FREE' ? 'orange' : 'green'}
            shape="default"
            icon={<CheckCircleOutlined />}
          >
            Change to {item.accountType === 'FREE' ? 'PREMIUM' : 'FREE'}
          </Button>
        </Tooltip>
      ),
    },
  ];

  const handleGetListUser = async () => {
    try {
      setLoading(true);
      const rs = await authService.getListUser(query);
      setListUser(rs.data.data);
      setQuery((pre) => ({
        ...pre,
        total: rs.data.total,
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetListUser();
  }, [query.page, query.isRequestChangeToPremium]);

  return (
    <div className="flex flex-col justify-start items-center space-y-5">
      <h1 className="font-bold text-3xl">Account Manager</h1>
      <div className="flex flex-row justify-between items-center w-full">
        <BaseSearch
          value={query.name!}
          placeholder="Input search text"
          onHandleChange={(value) => {
            setQuery({ ...query, name: value });
          }}
          onSearch={() => handleGetListUser()}
        />
        <Checkbox
          value={query.isRequestChangeToPremium}
          onChange={(event) => {
            setQuery({
              ...query,
              isRequestChangeToPremium: event.target.checked,
            });
          }}
        >
          Search user request account to PREMIUM
        </Checkbox>
      </div>
      {loading ? (
        <Spin />
      ) : (
        <div className="w-full">
          <Table<IUser>
            rowKey="id"
            className="cursor-pointer"
            columns={columns}
            dataSource={userList}
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
