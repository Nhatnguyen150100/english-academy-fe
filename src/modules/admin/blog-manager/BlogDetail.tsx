import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IBlogDetail } from '../../../types/blogs.types';
import { blogService } from '../../../services';
import { Button, Empty, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Visibility from '../../../components/base/visibility';

type Props = {};

export default function BlogDetail({}: Props) {
  const navigate = useNavigate();
  const { blogId } = useParams<{ blogId: string }>();
  const [blog, setBlog] = useState<IBlogDetail>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleGetBlogDetail = async () => {
    if (!blogId) return;
    try {
      setLoading(true);
      const rs = await blogService.getBlogDetail(blogId);
      setBlog(rs.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetBlogDetail();
  }, []);

  return (
    <>
      <Button
        className="min-w-[220px]"
        icon={<ArrowLeftOutlined />}
        onClick={() => {
          navigate(-1);
        }}
      >
        Back
      </Button>
      <div className="flex w-full flex-col justify-center items-center space-y-5">
        <h1 className="font-bold text-3xl">Blog Detail</h1>
        <Visibility
          visibility={Boolean(blog?._id)}
          suspenseComponent={loading ? <Spin /> : <Empty />}
        >
          {blog && (
            <div className="w-full p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-3xl font-bold mb-4">{blog.title}</h2>

              {/* Metadata Section */}
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-2">
                  <p className="text-gray-600">
                    Author:{' '}
                    <span className="font-semibold">
                      {blog.userId.name ?? blog.userId.email}
                    </span>
                  </p>
                  <div className="text-sm text-gray-500">
                    <p>
                      Created: {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                    {blog.updatedAt !== blog.createdAt && (
                      <p>
                        Updated: {new Date(blog.updatedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    blog.statusBlog === 'APPROVED'
                      ? 'bg-green-100 text-green-800'
                      : blog.statusBlog === 'PENDING_APPROVED'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {blog.statusBlog.replace('_', ' ')}
                </span>
              </div>

              {/* Thumbnail */}
              <div className="w-full flex justify-center items-center">
                <img
                  src={blog.thumbnail}
                  alt={blog.title}
                  className="max-w-[70%] h-auto object-cover mb-6 rounded-lg"
                />
              </div>

              {/* Description */}
              <p className="text-lg text-gray-700 mb-6">{blog.description}</p>

              {/* Content */}
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
          )}
        </Visibility>
      </div>
    </>
  );
}
