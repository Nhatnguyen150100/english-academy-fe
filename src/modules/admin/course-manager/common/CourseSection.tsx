import {
  Button,
  Form,
  FormProps,
  Input,
  message,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { ICourse } from '../../../../types/course.type';

interface IProps {
  item?: ICourse;
  handleSubmit: (data: Record<string, any>) => void;
}

type FieldType = {
  name: string;
  description: string;
};

export default function CourseSection({ item, handleSubmit }: IProps) {
  console.log("🚀 ~ CourseSection ~ item:", item)
  const [form] = Form.useForm();

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      const data = { ...values };

      const body = {
        name: data.name,
        description: data.description,
      };

      handleSubmit(body);
    } catch (error: any) {
      message.error(error?.message);
    }
  };

  return (
    <div className="w-full pe-10">
      <Form
        className="w-full mt-5"
        form={form}
        labelCol={{ span: 6 }}
        labelAlign="left"
        name="form"
        onFinish={onFinish}
        initialValues={{
          name: item?.name,
          description: item?.description,
        }}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Course name"
          name="name"
          rules={[{ required: true, message: 'Please enter course name' }]}
        >
          <Input className="w-full" size="large" />
        </Form.Item>

        <Form.Item<FieldType>
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please enter course description' }]}
        >
          <TextArea className="w-full"/>
        </Form.Item>

        <div className="w-full flex justify-end items-end my-5">
          <Button type="primary" htmlType="submit">
            {item?._id ? 'Update course info' : 'Add new course'}
          </Button>
        </div>
      </Form>
    </div>
  );
}
