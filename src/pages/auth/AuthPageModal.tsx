import { Button, Form, Input } from 'antd';

interface childrenType {
  onCancel: (value: boolean) => void;
}

const AuthPageModal = (props: childrenType): React.ReactElement => {
  const { onCancel } = props;

  return (
    <>
      <Form className="mt-4" labelCol={{ span: 6 }} name="control-hooks">
        <Form.Item name="title" label="제목" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="content" label="내용" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6 }}>
          <Button
            htmlType="button"
            onClick={() => {
              onCancel(false);
            }}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default AuthPageModal;
