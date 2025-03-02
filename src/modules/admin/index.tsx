import { useSelector } from 'react-redux';
import { RootState } from '../../lib/store';
import { Navigate, Outlet } from 'react-router-dom';
import DEFINE_ROUTERS from '../../constants/routers-mapper';
import Sidebar from '../../components/layout/SideBar';

interface IProps {}

export default function TheAdminLayout({}: IProps) {
  const user = useSelector((state: RootState) => state.user);
  const isLoggedIn = user._id && user.role === 'ADMIN';

  if (!isLoggedIn) {
    return (
      <div className="h-full w-full justify-center flex-col space-y-5 mt-10 flex items-center text-3xl font-bold text-red-600">
        Unauthorized
        <Navigate to={DEFINE_ROUTERS.loginAdmin} replace />
      </div>
    );
  }

  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="px-14 w-full py-10 h-screen overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
