/**
 ***************************************************************************
 * @author junghwan.an
 * @version 0.1
 * @since 2023.08.14
 * @description: LoginLayout
 ***************************************************************************
 * */

import { Outlet } from 'react-router-dom';
import BrowserStorageUtil from '@/common/util/BrowserStorageUtil.ts';

function LoginLayout(): React.ReactElement {
  const nvg = useNavigate();

  useEffect(() => {
    if (!BrowserStorageUtil.getItem('ACCESSTOKEN_KEY')) {
      nvg('/login', { replace: true });
      // nvg('/education', { replace: true });
    } else {
      nvg('/', { replace: true });
    }
  }, []);

  return (
    <main>
      <Outlet />
    </main>
  );
}

export default LoginLayout;
