import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ICourse } from '../../../types/course.type';
import { chapterService, courseService } from '../../../services';
import Visibility from '../../../components/base/visibility';
import {
  Button,
  Empty,
  message,
  Spin,
  Tabs,
  TabsProps,
  List,
  Form,
  Input,
} from 'antd';
import CourseSection from './common/CourseSection';
import ExamManager from './exam-manager/ExamManager';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { IChapter } from '../../../types/chapter.types';

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<ICourse>();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedChapter, setSelectedChapter] = useState<IChapter | null>(null);
  const navigate = useNavigate();

  const [editingChapter, setEditingChapter] = useState<IChapter | null>(null);
  const [form] = Form.useForm();

  const handleUpdateChapter = async (
    chapterId: string,
    values: Partial<IChapter>,
  ) => {
    try {
      setLoading(true);
      const response = await chapterService.updateChapter(chapterId, values);
      message.success(response.message);

      if (course) {
        const updatedChapters = course.chapters.map((chapter) =>
          chapter._id === chapterId ? { ...chapter, ...values } : chapter,
        );
        setCourse({ ...course, chapters: updatedChapters });
      }

      setEditingChapter(null);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetCourseDetail = async () => {
    if (!courseId) return;
    try {
      setLoading(true);
      const rs = await courseService.getCourseDetail(courseId);
      setCourse(rs.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetCourseDetail();
  }, []);

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      setLoading(true);
      const rs = await courseService.updateCourse(courseId!, data);
      message.success(rs.message);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const ChapterList = ({ chapters }: { chapters: IChapter[] }) => (
    <List
      dataSource={chapters}
      renderItem={(chapter) => (
        <List.Item
          actions={[
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setEditingChapter(chapter);
                form.setFieldsValue(chapter);
              }}
            />,
            <Button onClick={() => setSelectedChapter(chapter)}>
              View list exam
            </Button>,
          ]}
        >
          <List.Item.Meta
            title={chapter.title}
            description={chapter.description}
          />
        </List.Item>
      )}
    />
  );

  const ChapterEditForm = ({ chapter }: { chapter: IChapter }) => (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => setEditingChapter(null)}
        style={{ marginBottom: 16 }}
      >
        Quay lại
      </Button>

      <Form
        form={form}
        layout="vertical"
        initialValues={chapter}
        onFinish={(values) => handleUpdateChapter(chapter._id, values)}
      >
        <Form.Item
          label="Chapter title"
          name="title"
          rules={[{ required: true, message: 'Please enter chapter title!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            { required: true, message: 'Please enter chapter description!' },
          ]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>
    </div>
  );

  const tabContent = () => {
    if (editingChapter) {
      return <ChapterEditForm chapter={editingChapter} />;
    }

    if (selectedChapter) {
      return (
        <div>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => setSelectedChapter(null)}
            style={{ marginBottom: 16 }}
          >
            Back to list chapter
          </Button>
          <ExamManager chapterId={selectedChapter._id} />
        </div>
      );
    }

    return <ChapterList chapters={course?.chapters || []} />;
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Course information',
      children: (
        <Visibility
          visibility={Boolean(course)}
          suspenseComponent={loading ? <Spin /> : <Empty />}
        >
          <CourseSection item={course} handleSubmit={handleSubmit} />
        </Visibility>
      ),
    },
    {
      key: '2',
      label: 'List chapters',
      children: (
        <Visibility
          visibility={Boolean(course)}
          suspenseComponent={loading ? <Spin /> : <Empty />}
        >
          {tabContent()}
        </Visibility>
      ),
    },
  ];

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
      <Tabs defaultActiveKey="1" items={items} />
    </>
  );
}
