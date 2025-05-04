/**
 ***************************************************************************
 * @author junghwan.an
 * @version 0.1
 * @since 2023.07.27
 * @description: Login 컴포넌트
 ***************************************************************************
 * */
import { Button, Checkbox, Form, Input } from 'antd';
import logo from '@/assets/logo.png';
import axios from '@/apis/callApi.ts';
import BrowserStorageUtil from '@/common/util/BrowserStorageUtil.ts';
import './login.scss';

const Login = (): React.ReactElement => {
  const callApi = axios();

  const onFinish = async (values: any) => {
    const { data, isSuccess }: APIResponse = await callApi
      .post('/auth/login', values)
      .then((response) => response.data)
      .catch((error) => {
        Promise.reject(error.response);
      });
    if (isSuccess) {
      BrowserStorageUtil.setItem('ACCESSTOKEN_KEY', data.accessToken);
      BrowserStorageUtil.setItem('REFRESHTOKEN_KEY', data.refreshToken);
      BrowserStorageUtil.setItem('USER_INFO', data.userInfo);
      BrowserStorageUtil.setItem('MENU_LIST', data.menuList);

      window.location.href = '/';
    }
  };

  return (
    <div className="login-page">
      <div className="card">
        <div className="logo" style={{ paddingLeft: '40%' }}>
          <img src={logo} alt="logo" />
        </div>
        <Form
          onFinish={onFinish}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          <Form.Item
            label="userId"
            name="userId"
            rules={[{ required: true, message: 'Please input your userId!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
