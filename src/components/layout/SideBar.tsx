import { Link, useLocation } from 'react-router-dom';
import {
  AuditOutlined,
  FormOutlined,
  LoginOutlined,
  PieChartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Divider } from 'antd';
import DEFINE_ROUTERS from '../../constants/routers-mapper';
import cookiesStore from '../../plugins/cookiesStore';
import isChildUrl from '../../utils/functions/check-active-router';
import { useDispatch } from 'react-redux';
import { clearUser } from '../../lib/reducer/userSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const menuItems = [
    {
      path: DEFINE_ROUTERS.admin,
      label: 'Statistics management',
      icon: <PieChartOutlined />,
    },
    {
      path: DEFINE_ROUTERS.accountManager,
      label: 'Account manager',
      icon: <UserOutlined />,
    },
    {
      path: DEFINE_ROUTERS.blogManager,
      label: 'Blog manager',
      icon: <FormOutlined />,
    },
    {
      path: DEFINE_ROUTERS.courseManager,
      label: 'Course manager',
      icon: <AuditOutlined />,
    },
  ];

  const handleLogOut = () => {
    cookiesStore.remove('admin');
    cookiesStore.remove('access_token');
    window.location.href = DEFINE_ROUTERS.home;
    dispatch(clearUser());
  };

  return (
    <div className="flex flex-col max-w-[320px] h-screen bg-blue-950 text-white">
      <div className="flex flex-col items-center justify-center h-24">
        <h1 className="text-2xl font-bold">Manager</h1>
        <Divider className="w-20 bg-white !mb-0" />
      </div>
      <div className="flex flex-col mt-4 px-5 space-y-3">
        {menuItems.map((item) => {
          const isActive = isChildUrl(item.path, location.pathname);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center py-3 px-4 hover:bg-white hover:text-blue-950 transition-colors rounded-2xl ${
                isActive ? 'bg-white text-blue-950' : ''
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              <span className="text-nowrap">{item.label}</span>
            </Link>
          );
        })}
        <div
          className="flex items-center py-3 px-4 hover:cursor-pointer hover:bg-white hover:text-blue-950 transition-colors rounded-2xl"
          onClick={handleLogOut}
        >
          <span className="mr-2">{<LoginOutlined />}</span>
          Log out
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
