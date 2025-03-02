import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import DEFINE_ROUTERS from '../constants/routers-mapper';
import { RootState } from '../lib/store';
import { useSelector } from 'react-redux';
import cookiesStore from '../plugins/cookiesStore';

const App: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const isLoggedIn = Boolean(
    user._id && user.role === 'ADMIN' && cookiesStore.get('access_token'),
  );

  return (
    <>
      {!isLoggedIn ? (
        <Navigate to={DEFINE_ROUTERS.loginAdmin} replace />
      ) : (
        <Navigate to={DEFINE_ROUTERS.admin} replace />
      )}
    </>
  );
};

export default App;
