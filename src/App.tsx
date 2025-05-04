/**
 ***************************************************************************
 * @author junghwan.an
 * @version 0.1
 * @since 2023.07.24
 * @description: App 컴포넌트 (router use with suspense )
 ***************************************************************************
 * */
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Spin, ConfigProvider } from 'antd';
import ErrorFallback from '@/pages/error/ErrorFallback.tsx';
import WrapRouterProvider from '@/routers/WrapRouterProvider.tsx';
import './App.css';

const callback = () => (
  <>
    <div className="wrapper">
      <Spin size="large" />
    </div>
  </>
);

function App(): React.ReactElement {
  useLayoutEffect(() => {
    callback();
  }, []);

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#e60012',
            borderRadius: 2
          }
        }}
      >
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={callback()}>
            <WrapRouterProvider />
          </Suspense>
        </ErrorBoundary>
      </ConfigProvider>
    </>
  );
}

export default App;
