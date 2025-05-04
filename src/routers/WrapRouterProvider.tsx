import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MenuObj, ChildrenProps } from '@/routers/ts/index.ts';
import ElementComponentError from '@/pages/error/ElementComponentError.tsx';
import BrowserStorageUtil from '@/common/util/BrowserStorageUtil.ts';

const LoginLayout = lazy(() => import('@/layouts/LoginLayout.tsx'));
const Login = lazy(() => import('@/pages/login/Login.tsx'));
const MainLayout = lazy(() => import('@/layouts/MainLayout.tsx'));
const Error = lazy(() => import('@/pages/error/Error.tsx'));
const DynamicPathComponent = lazy(() => import('@/components/DynamicPathComponent.tsx'));

const totalMenuList: MenuObj[] = BrowserStorageUtil.getItem('MENU_LIST');
const userInfo = BrowserStorageUtil.getItem('USER_INFO');

const defaultChildrenMenu: ChildrenProps[] = [
  {
    index: true,
    path: '/pages',
    element: <></>,
    errorElement: <ElementComponentError />
  }
];

const initPages = [
  {
    path: '/login',
    element: <LoginLayout />,
    children: [{ index: true, element: <Login />, errorElement: <ElementComponentError /> }],
    errorElement: <Error />
  },
  {
    path: '/',
    element: <MainLayout MenuList={[]} />,
    children: defaultChildrenMenu,
    errorElement: <Error />
  }
];

const FncChildrenPathAndElement = (totalMenu: MenuObj[]) => {
  const childrenMenuArr: ChildrenProps[] = totalMenu
    .map((list) => list.children ?? [])
    .map((arr) => arr.map((obj) => obj.menuUrl ?? []))
    .filter((val) => val.length > 0)
    .join()
    .split(',')
    .map((path) => ({
      path: path.split('..')[1].split('.')[0],
      element: <DynamicPathComponent componentPath={path} />,
      errorElement: <ElementComponentError />
    }));
  return childrenMenuArr;
};

const WrapRouterProvider = (): React.ReactElement => {
  const [isLoading, setIsLoading] = useState(false);
  const [dynamicPage, setDynamicPage] = useState<any>(createBrowserRouter(initPages));

  useEffect(() => {
    if (userInfo) {
      fncSetMenuList();
    }
    setIsLoading(true);
  }, [userInfo]);

  const fncSetMenuList = async () => {
    const childrenMenuList: ChildrenProps[] = FncChildrenPathAndElement(totalMenuList);
    const dynamicMenuPages = [
      {
        path: '/login',
        element: <LoginLayout />,
        children: [{ index: true, element: <Login />, errorElement: <ElementComponentError /> }],
        errorElement: <Error />
      },
      {
        path: '/',
        element: <MainLayout MenuList={totalMenuList} />,
        children: defaultChildrenMenu.concat(...childrenMenuList),
        errorElement: <Error />
      }
    ];
    setDynamicPage(createBrowserRouter([...dynamicMenuPages]));
  };

  return <>{isLoading && <RouterProvider router={dynamicPage} />}</>;
};

export default WrapRouterProvider;
