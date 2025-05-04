import { Button, Form, Input, Modal, Space, Table } from 'antd';
import axios from '@/apis/callApi.ts';
import AuthPageModal from '@/pages/auth/AuthPageModal.tsx';
import { getFullDate } from '@/common/util/tyUtill.ts';

function AuthPage(): React.ReactElement {
  const callApi = axios();
  const [form] = Form.useForm();
  const [gridData, setGridData] = useState<[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setGridData(gridData);
  }, [gridData]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const onModalClose = () => {
    setIsModalOpen(false);
  };

  const fncGetData = async (values: any) => {
    const { data, isSuccess }: APIResponse = await callApi
      .post('/board/retrieveBoardList')
      .then((response) => response.data)
      .catch((error) => {
        Promise.reject(error.response);
      });
    if (isSuccess) {
      setGridData(data);
    }
  };

  const columns = [
    {
      title: '게시판ID',
      dataIndex: 'boardId',
      key: 'boardId'
    },
    {
      title: '제목',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: '등록날짜',
      dataIndex: 'regDt',
      key: 'regDt',
      render: (date: string) => getFullDate(date)
    },
    {
      title: '등록자',
      dataIndex: 'regId',
      key: 'regId'
    }
  ];

  return (
    <div>
      <Form
        form={form}
        name="validateOnly"
        layout="inline"
        autoComplete="off"
        onFinish={fncGetData}
        style={{
          height: '70px',
          padding: '10px 0 0 0'
        }}
      >
        <div className="FromWrapper">
          <Form.Item>
            <Form.Item
              label="제목"
              name="title"
              rules={[{ required: false, message: '제목 입력' }]}
            >
              <Input />
            </Form.Item>
          </Form.Item>
        </div>
        <Form.Item>
          <Space>
            <Button htmlType="submit">조회</Button>
            <Button type="primary" onClick={showModal}>
              등록
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <div>
        <Table dataSource={gridData} columns={columns} rowKey="boardId" />
      </div>
      <Modal
        title="등록"
        open={isModalOpen}
        footer={null}
        width="40%"
        style={{ top: 20 }}
        maskClosable={false}
      >
        <AuthPageModal onCancel={() => onModalClose()} />
      </Modal>
    </div>
  );
}

export default AuthPage;
AuthPage.displayName = 'AuthPage';
