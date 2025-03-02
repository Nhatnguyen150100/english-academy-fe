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
        <div className="flex h-full w-full justify-center items-center">
          <section className="h-full">
            <div className="container h-full p-10">
              <div className="g-6 flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
                <div className="w-full">
                  <div className="block rounded-lg bg-white shadow-lg dark:bg-blue-950">
                    <div className="g-0 lg:flex lg:flex-wrap">
                      <div className="px-4 md:px-0 lg:w-full">
                        <div className="md:mx-6 md:p-12">
                          {/* <!--Logo--> */}
                          <div className="text-center">
                            <img
                              className="mx-auto w-32"
                              src="https://flowbite.com/docs/images/logo.svg"
                              alt="logo"
                            />
                            <h4 className="mb-12 mt-1 pb-1 text-xl font-semibold">
                              Admin of KanjiWeb
                            </h4>
                          </div>

                          <form>
                            <p className="mb-4">Please login to your account</p>
                            {/* <!--Username input--> */}
                            <Input
                              type="text"
                              placeholder="Email"
                              className="mb-4"
                              value={form.email}
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
                              onChange={(e) => {
                                setForm((pre) => ({
                                  ...pre,
                                  password: e.target.value,
                                }));
                              }}
                            ></Input.Password>
                            <div className="mb-12 pb-1 pt-1 text-center">
                              <button
                                disabled={loading}
                                className="mb-3 bg-pink-900 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-0px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]"
                                type="button"
                                onClick={() => onHandleSubmit()}
                              >
                                Log in
                              </button>
                            </div>
                          </form>
                        </div>
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
