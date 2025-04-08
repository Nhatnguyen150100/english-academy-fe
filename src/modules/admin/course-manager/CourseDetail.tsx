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
  Modal,
  InputNumber,
} from 'antd';
import CourseSection from './common/CourseSection';
import ExamManager from './exam-manager/ExamManager';
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { IChapter } from '../../../types/chapter.types';

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<ICourse>();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedChapter, setSelectedChapter] = useState<IChapter | null>(null);
  const navigate = useNavigate();

  const [editingChapter, setEditingChapter] = useState<IChapter | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const [isCreatingNew, setIsCreatingNew] = useState(false);

  useEffect(() => {
    handleGetCourseDetail();
  }, []);

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

  const handleChapterAction = async (values: Partial<IChapter>) => {
    try {
      setLoading(true);
      if (editingChapter) {
        const response = await chapterService.updateChapter(
          editingChapter._id,
          values,
        );
        message.success(response.message);
        if (course) {
          const updatedChapters = course.chapters.map((chapter) =>
            chapter._id === editingChapter._id
              ? { ...chapter, ...values }
              : chapter,
          );
          setCourse({ ...course, chapters: updatedChapters });
        }
      } else {
        const response = await chapterService.createChapter({
          ...values,
          courseId: courseId!,
        });
        message.success(response.message);
        handleGetCourseDetail();
      }
      handleCloseModal();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    Modal.confirm({
      title: 'Confirm deletion',
      content: 'Are you sure you want to delete this chapter?',
      async onOk() {
        try {
          await chapterService.deleteChapter(chapterId);
          message.success('Chapter deleted successfully');
          if (course) {
            const updatedChapters = course.chapters.filter(
              (chapter) => chapter._id !== chapterId,
            );
            setCourse({ ...course, chapters: updatedChapters });
          }
        } catch (error: any) {
          message.error(error.message);
        }
      },
    });
  };

  const handleOpenCreateModal = () => {
    setIsCreatingNew(true);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleOpenEditModal = (chapter: IChapter) => {
    setEditingChapter(chapter);
    form.setFieldsValue(chapter);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingChapter(null);
    setIsCreatingNew(false);
  };

  const ChapterList = ({ chapters }: { chapters: IChapter[] }) => (
    <div className="space-y-4">
      <Button type="primary" onClick={handleOpenCreateModal}>
        Add New Chapter
      </Button>
      <List
        dataSource={chapters}
        renderItem={(chapter) => (
          <List.Item
            actions={[
              <Button
                icon={<EditOutlined />}
                onClick={() => handleOpenEditModal(chapter)}
              />,
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteChapter(chapter._id)}
              />,
              <Button onClick={() => setSelectedChapter(chapter)}>
                View Exams
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={
                <span>
                  {chapter.title} (Order: {chapter.order})
                </span>
              }
              description={chapter.description}
            />
          </List.Item>
        )}
      />
    </div>
  );

  const ChapterModal = () => (
    <Modal
      title={`${isCreatingNew ? 'Create' : 'Edit'} Chapter`}
      visible={isModalVisible}
      onCancel={handleCloseModal}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ order: 1 }}
        onFinish={handleChapterAction}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: 'Please input chapter title!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            { required: true, message: 'Please input chapter description!' },
          ]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Order"
          name="order"
          rules={[{ required: true, message: 'Please input chapter order!' }]}
        >
          <InputNumber min={1} />
        </Form.Item>

        <div className="flex justify-end space-x-4">
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            {isCreatingNew ? 'Create' : 'Update'}
          </Button>
        </div>
      </Form>
    </Modal>
  );

  const tabContent = () => {
    if (selectedChapter) {
      return (
        <div>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => setSelectedChapter(null)}
            style={{ marginBottom: 16 }}
          >
            Back to Chapters
          </Button>
          <ExamManager chapterId={selectedChapter._id} />
        </div>
      );
    }
    return <ChapterList chapters={course?.chapters || []} />;
  };

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

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Course Information',
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
      label: 'Chapters',
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
        onClick={() => navigate(-1)}
      >
        Back
      </Button>

      <Tabs defaultActiveKey="1" items={items} />
      <ChapterModal />
    </>
  );
}
