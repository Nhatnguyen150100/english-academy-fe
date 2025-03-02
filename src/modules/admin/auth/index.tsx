import { Input } from 'antd';
import * as React from 'react';
import { toast } from 'react-toastify';
import { authService } from '../../../services';
import { useDispatch, useSelector } from 'react-redux';
import cookiesStore from '../../../plugins/cookiesStore';
import { RootState } from '../../../lib/store';
import { Navigate } from 'react-router-dom';
import DEFINE_ROUTERS from '../../../constants/routers-mapper';
import { setUser } from '../../../lib/reducer/userSlice';

export default function LoginAdminPage() {
  const user = useSelector((state: RootState) => state.user);
  const isLoggedIn = user._id && user.role === 'ADMIN';

  const dispatch = useDispatch();
  const [form, setForm] = React.useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = React.useState(false);

  const onHandleSubmit = async () => {
    if (!(form.email && form.password)) {
      toast.error('Please enter email and password');
      return;
    }
    try {
      setLoading(true);
      const rs = await authService.login({
        email: form.email,
        password: form.password,
      });
      if (rs.data.user.role !== 'ADMIN') {
        toast.error('You are not admin. Please try again.');
        return;
      }
      cookiesStore.set('access_token', rs.data.accessToken);
      dispatch(setUser(rs.data.user));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <Navigate to={DEFINE_ROUTERS.admin} replace />
      ) : (
        <div
          className="flex h-[100vh] w-full justify-center items-center"
          style={{
            backgroundImage: `url(/background_desktop.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <section className="h-full">
              <div className="g-6 flex h-full flex-wrap items-center justify-center text-neutral-200">
                <div className="w-full">
                  <div className="block rounded-lg bg-white shadow-lg">
                    <div className="g-0 lg:flex lg:flex-wrap">
                      <div className="px-4 md:px-0 lg:w-full">
                        <div className="md:mx-6 md:p-12">
                          <div className="text-center flex flex-col justify-center items-center">
                          <img
                              className="h-[120px] w-[120px] object-cover rounded-full mb-4"
                              src="/english_icon.png"
                              alt="English Academy Logo"
                            />
                            <h4 className="mb-6 mt-1 pb-1 text-2xl font-semibold max-w-[460px] text-blue-950">
                              ADMIN of English Academy
                            </h4>
                          </div>

                          <form>
                            <p className="mb-4 text-blue-950">
                              Login your account
                            </p>
                            {/* <!--email input--> */}
                            <Input
                              type="text"
                              placeholder="Email"
                              className="mb-4"
                              value={form.email}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  onHandleSubmit();
                                }
                              }}
                              onChange={(e) => {
                                setForm((pre) => ({
                                  ...pre,
                                  email: e.target.value,
                                }));
                              }}
                            ></Input>
                            <Input.Password
                              type="password"
                              placeholder="Password"
                              className="mb-4"
                              value={form.password}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  onHandleSubmit();
                                }
                              }}
                              onChange={(e: any) => {
                                setForm((pre) => ({
                                  ...pre,
                                  password: e.target.value,
                                }));
                              }}
                            ></Input.Password>
                            <div className="mb-12 pb-1 pt-1 text-center">
                              <button
                                disabled={loading}
                                className="mb-3 text-base bg-blue-950 inline-block w-full rounded px-6 pb-2 pt-2.5  font-medium uppercase leading-normal"
                                type="button"
                                onClick={() => onHandleSubmit()}
                              >
                                Login
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </section>
        </div>
      )}
    </>
  );
}
