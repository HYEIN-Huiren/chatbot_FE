import { Layout } from 'antd';
import axios from '@/apis/callApi.ts';
import logo from '@/assets/logo.png';
import '../App.css';
import BrowserStorageUtil from '@/common/util/BrowserStorageUtil.ts';

const { Header } = Layout;

interface UserToken {
  active: string;
  email: string;
  name: string;
  role: string;
  userId: string;
}

function HeaderContainer(): React.ReactElement {
  const callApi = axios();
  const nvg = useNavigate();
  const user: UserToken = BrowserStorageUtil.getItem('USER_INFO');

  const FncLogout = async () => {
    const { isSuccess }: APIResponse = await callApi
      .post('/auth/logout', {})
      .then((response) => response.data)
      .catch((error) => {
        Promise.reject(error.response);
      });

    if (isSuccess) {
      window.localStorage.clear();
      nvg('/login', { replace: true });
    } else {
      alert('로그아웃도중 에러가 발생했습니다.');
    }
  };

  return (
    user && (
      <>
        <Header className="Header_area" style={{ height: '70px' }}>
          <img src={logo} className="logo " alt="logo" />

          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}
          >
            <button type="button" onClick={FncLogout}>
              로그아웃
            </button>
          </div>
        </Header>
      </>
    )
  );
}

export default HeaderContainer;
