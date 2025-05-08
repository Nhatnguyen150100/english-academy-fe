import { useEffect, useState } from 'react';
import { Checkbox, Spin, Table, TableProps, Tag } from 'antd';
import BaseSearch from '../../../components/base/BaseSearch';
import { authService } from '../../../services';
import { IUser } from '../../../types/user.types';

export default function AccountManager() {
  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    name: '',
    total: 0,
  });
  const [userList, setListUser] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);

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
      title: 'Time expire',
      key: 'premiumExpiresAt',
      dataIndex: 'premiumExpiresAt',
      render: (text) => (
        <span className="text-xl font-semibold">
          {text
            ? new Date(text).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : ''}
        </span>
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
  }, [query.page]);

  return (
    <div className="flex flex-col justify-start items-center space-y-5">
      <h1 className="font-bold text-3xl">Account Manager</h1>
      <div className="flex flex-row justify-start items-center w-full">
        <BaseSearch
          value={query.name!}
          placeholder="Input search text"
          onHandleChange={(value) => {
            setQuery({ ...query, name: value });
          }}
          onSearch={() => handleGetListUser()}
        />
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
