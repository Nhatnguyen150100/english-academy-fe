// src/pages/StatisticsManager.tsx
import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Spin, Tabs } from 'antd';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { IUser } from '../../types/user.types';
import { IBlogInfo } from '../../types/blogs.types';
import { ICourse } from '../../types/course.type';
import {
  FaUsers,
  FaChartPie,
  FaBlog,
  FaBlogger,
  FaBookOpen,
  FaDollarSign,
} from 'react-icons/fa';
import { authService, blogService, courseService } from '../../services';
import { IPaymentStatistic } from '../../types/payment';

const cardStyle = `
  bg-gradient-to-br from-white to-blue-50 
  shadow-lg hover:shadow-xl 
  transition-all duration-300 
  border border-blue-100
  rounded-2xl
`;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const StatisticsManager = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [blogs, setBlogs] = useState<IBlogInfo[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [statisticPayment, setStatisticPayment] = useState<IPaymentStatistic>();
  console.log('🚀 ~ StatisticsManager ~ statisticPayment:', statisticPayment);
  const [currentPeriod, setCurrentPeriod] = useState<
    'daily' | 'monthly' | 'yearly'
  >('daily');

  const handleGetData = async () => {
    try {
      setLoading(true);
      const user = await authService.getListUser({
        page: 1,
        limit: 100000,
      });
      const courses = await courseService.getAllCourse({
        page: 1,
        limit: 100000,
      });
      const blogs = await blogService.getAllBlogs({
        page: 1,
        limit: 100000,
      });

      setUsers(user.data.data);
      setCourses(courses.data.data);
      setBlogs(blogs.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetPaymentData = async (type: 'daily' | 'monthly' | 'yearly') => {
    try {
      const payment = await authService.statisticPayment(type);
      setStatisticPayment(payment.data);
    } catch (error) {
      console.error('Error fetching payment stats:', error);
    }
  };

  useEffect(() => {
    handleGetData();
    handleGetPaymentData('daily');
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  const userStats = {
    free: users.filter((u) => u.accountType === 'FREE').length,
    premium: users.filter((u) => u.accountType === 'PREMIUM').length,
    pendingRequests: users.filter((u) => u.isRequestChangeToPremium).length,
  };

  const blogStats = {
    totalLikes: blogs.reduce((sum, blog) => sum + blog.likes.length, 0),
    byStatus: blogs.reduce((acc, blog) => {
      acc[blog.statusBlog] = (acc[blog.statusBlog] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  const examStats = {
    total: courses.reduce(
      (sum, course) =>
        sum +
        course.chapters.reduce(
          (chapSum, chap) => chapSum + chap.exams.length,
          0,
        ),
      0,
    ),
    byLevel: courses.reduce((acc, course) => {
      course.chapters.forEach((chap) => {
        chap.exams.forEach((exam) => {
          acc[exam.level] = (acc[exam.level] || 0) + 1;
        });
      });
      return acc;
    }, {} as Record<string, number>),
  };

  const userChartData = [
    { name: 'Free', value: userStats.free },
    { name: 'Premium', value: userStats.premium },
  ];

  const examChartData = Object.entries(examStats.byLevel).map(
    ([level, count]) => ({ level, count }),
  );

  const blogStatusData = Object.entries(blogStats.byStatus).map(
    ([status, count]) => ({ status, count }),
  );

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-blue-800">
        <FaChartPie className="text-4xl" />
        Statistics Dashboard
      </h1>

      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24}>
          <Card className={cardStyle}>
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <FaDollarSign className="text-3xl text-green-600" />
                  </div>
                  <Statistic
                    title={
                      <span className="text-lg font-semibold">
                        Total Revenue
                      </span>
                    }
                    value={`${
                      statisticPayment?.totalAmount.toLocaleString() || 0
                    } VND`}
                    valueStyle={{ fontSize: '28px', color: '#065f46' }}
                  />
                </div>
                <Tabs
                  activeKey={currentPeriod}
                  onChange={(key) => {
                    setCurrentPeriod(key as 'daily' | 'monthly' | 'yearly');
                    handleGetPaymentData(key as 'daily' | 'monthly' | 'yearly');
                  }}
                >
                  <Tabs.TabPane tab="Daily" key="daily" />
                  <Tabs.TabPane tab="Monthly" key="monthly" />
                  <Tabs.TabPane tab="Yearly" key="yearly" />
                </Tabs>
              </div>

              <div className="h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statisticPayment?.stats || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: '#6b7280' }}
                      tickFormatter={(value) => value}
                    />
                    <YAxis tick={{ fill: '#6b7280' }} tickFormatter={(value) => value.toLocaleString()}/>
                    <Tooltip
                      cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                      contentStyle={{
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      }}
                      formatter={(value) => [
                        `${value.toLocaleString()} VND`,
                        'Total Amount',
                      ]}
                    />
                    <Bar
                      dataKey="totalAmount"
                      radius={[6, 6, 0, 0]}
                      animationBegin={200}
                    >
                      {statisticPayment?.stats?.map((_, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24}>
          <Card className={cardStyle}>
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <FaUsers className="text-3xl text-blue-600" />
                </div>
                <Statistic
                  title={
                    <span className="text-lg font-semibold">Total Users</span>
                  }
                  value={users.length}
                  valueStyle={{ fontSize: '28px', color: '#1e3a8a' }}
                />
              </div>
              <div className="flex gap-8">
                <div className="flex-1 max-w-[300px]">
                  <div className="space-y-3">
                    <div className="bg-blue-50 px-3 py-2 rounded-lg">
                      <span className="font-medium text-blue-700">FREE:</span>
                      <span className="text-xl font-bold ml-2 text-blue-900">
                        {userStats.free}
                      </span>
                    </div>
                    <div className="bg-amber-50 px-3 py-2 rounded-lg">
                      <span className="font-medium text-amber-700">
                        PREMIUM:
                      </span>
                      <span className="text-xl font-bold ml-2 text-amber-900">
                        {userStats.premium}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                      <YAxis tick={{ fill: '#6b7280' }} />
                      <Tooltip
                        cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                        contentStyle={{
                          borderRadius: '12px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        }}
                      />
                      <Bar
                        dataKey="value"
                        radius={[6, 6, 0, 0]}
                        animationBegin={200}
                      >
                        {userChartData.map((item, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={item.name === 'Free' ? '#3b82f6' : '#fbbf24'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Second Row */}
      <Row gutter={[24, 24]} className="mb-6">
        {/* Exam Statistics */}
        <Col xs={24} md={12}>
          <Card className={cardStyle + ' h-full'}>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-3 rounded-xl">
                <FaBookOpen className="text-3xl text-purple-600" />
              </div>
              <Statistic
                title={
                  <span className="text-lg font-semibold">Total Exams</span>
                }
                value={examStats.total}
                valueStyle={{ fontSize: '28px', color: '#4c1d95' }}
              />
            </div>

            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={examChartData}>
                  <XAxis dataKey="level" tick={{ fill: '#6b7280' }} />
                  <YAxis tick={{ fill: '#6b7280' }} />
                  <Bar
                    dataKey="count"
                    radius={[6, 6, 0, 0]}
                    animationBegin={200}
                  >
                    {examChartData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                  <Tooltip
                    cursor={false}
                    contentStyle={{
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2">
              {Object.entries(examStats.byLevel).map(
                ([level, count], index) => (
                  <div
                    key={level}
                    className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index] }}
                      />
                      <span className="font-medium text-gray-600">{level}</span>
                    </div>
                    <span className="font-bold text-gray-800">{count}</span>
                  </div>
                ),
              )}
            </div>
          </Card>
        </Col>

        {/* Blog Statistics */}
        <Col xs={24} md={12}>
          <Card className={cardStyle + ' h-full'}>
            <div className="flex flex-row justify-between items-center gap-3 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-yellow-100 p-3 rounded-xl">
                  <FaBlogger className="text-3xl text-yellow-500" />
                </div>
                <Statistic
                  title={
                    <span className="text-lg font-semibold">Total blogs</span>
                  }
                  value={blogs.length}
                  valueStyle={{ fontSize: '28px', color: '#065f46' }}
                />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 p-3 rounded-xl">
                  <FaBlog className="text-3xl text-green-600" />
                </div>
                <Statistic
                  title={
                    <span className="text-lg font-semibold">Total Likes</span>
                  }
                  value={blogStats.totalLikes}
                  valueStyle={{ fontSize: '28px', color: '#065f46' }}
                />
              </div>
            </div>

            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={blogStatusData}>
                  <XAxis dataKey="status" tick={{ fill: '#6b7280' }} />
                  <YAxis tick={{ fill: '#6b7280' }} />
                  <Bar
                    dataKey="count"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                    animationBegin={200}
                  >
                    {blogStatusData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {Object.entries(blogStats.byStatus).map(([status, count]) => (
                <div
                  key={status}
                  className="p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100"
                >
                  <div className="text-sm font-medium text-gray-500">
                    {status}
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {count}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsManager;
