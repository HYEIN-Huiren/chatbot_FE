import { Outlet } from 'react-router-dom';
import { ConfigProvider, Layout, Spin } from 'antd';
import { AliasToken } from 'antd/es/theme/internal';
import HeaderContainer from '@/components/HeaderContainer.tsx';
import MenuContainer from '@/components/MenuContainer.tsx';
import BrowserStorageUtil from '@/common/util/BrowserStorageUtil.ts';
import '../style/MainLayout.css';
import { MenuObj } from '@/routers/ts/index.ts';

const { Content, Footer } = Layout;

export const antStyleConfig: Partial<AliasToken> = {
  colorLink: '#ff4d4f'
};

interface interfaceMenuList {
  MenuList: MenuObj[];
}

function MainLayout({ MenuList }: interfaceMenuList): React.ReactElement {
  const { isLoading } = globalStateStore((state) => state);

  const nvg = useNavigate();

  useEffect(() => {
    if (!BrowserStorageUtil.getItem('ACCESSTOKEN_KEY')) {
      nvg('/login', { replace: true });
    } else {
      nvg(MenuList[0].children[0].menuUrl.split('..')[1].split('.tsx')[0], { replace: true });
    }
  }, []);

  return (
    <>
      {MenuList && (
        <ConfigProvider
          theme={{
            token: antStyleConfig
          }}
        >
          <Spin spinning={isLoading} size="large">
            <Layout>
              <HeaderContainer />
              <Layout>
                <div className="Mainbody">
                  <MenuContainer MenuList={MenuList} />
                  <Layout>
                    <Layout
                      style={{
                        height: '100%',
                        width: 'calc(100vw - 300px)',
                        padding: '24px'
                      }}
                    >
                      <Content className="main-content">
                        <Outlet />
                      </Content>
                    </Layout>
                  </Layout>
                </div>
              </Layout>

              <Footer style={{ textAlign: 'center', height: '70px' }}>
                Copyright ©2024 Tongyang Systems. 2024 All Rights Reserved.
              </Footer>
            </Layout>
          </Spin>
        </ConfigProvider>
      )}
    </>
  );
}

export default MainLayout;
