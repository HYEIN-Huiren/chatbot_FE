import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { MenuObj } from '@/routers/ts/index.ts';

type MenuItem = Required<MenuProps>['items'][number];
function setMenu(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label
  } as MenuItem;
}

function MenuContainer(props: { MenuList: MenuObj[] }): React.ReactElement {
  const { MenuList } = props;
  const nvg = useNavigate();
  const [customMenu, setCustomMenu] = useState<any>([]);

  useEffect(() => {
    if (MenuList.length > 0) {
      fncMakeMenuList(MenuList);
    }
  }, [MenuList]);

  const fncMakeMenuList = (menuList: MenuObj[]) => {
    const bigAndMidMenuObj = {
      label: '',
      key: '',
      icon: <></>,
      children: []
    };
    const putMenuArr: any[] = Array.from({ length: menuList.length }, () => bigAndMidMenuObj);
    // 대메뉴
    for (let i = 0; i < menuList.length; i++) {
      const bigMenu = menuList[i];
      putMenuArr[i] = setMenu(bigMenu.menuNm, bigMenu.menuId, <></>, []);
      putMenuArr[i]!.children = Array.from({ length: 0 }, () => bigAndMidMenuObj);
      // 중메뉴
      for (let mid = 0; mid < bigMenu.children.length; mid++) {
        const midObj = bigMenu.children[mid];
        const midMenu = setMenu(midObj.menuNm, midObj.menuUrl.split('..')[1].split('.tsx')[0]);
        putMenuArr[i]!.children.push(midMenu);
        if (midObj.children !== null && midObj.children[0] !== undefined) {
          // 3뎁스에 {label : "" , key : ""} 만 넣어준다.
          const smallMenuType = { label: '', key: '' };
          putMenuArr[i]!.children[mid].children = Array.from(
            { length: bigMenu.children[mid].children.length },
            () => smallMenuType
          );
          // 소메뉴
          for (let small = 0; small < bigMenu.children[mid].children.length; small++) {
            const smallMenu = setMenu(
              bigMenu.children[mid].children[small].menuNm,
              bigMenu.children[mid].children[small].menuUrl.split('..')[1].split('.tsx')[0]
            );
            putMenuArr[i]!.children[mid].children[small] = smallMenu;
          }
        }
      }
    }
    setCustomMenu(putMenuArr);
  };

  const fncMenuClick: MenuProps['onClick'] = (e) => {
    const path = `${e.key}`;
    nvg(path);
  };

  return (
    <>
      <div className="demo-logo-vertical" />
      <Menu
        onClick={fncMenuClick}
        theme="light"
        defaultSelectedKeys={['1']}
        mode="vertical"
        items={customMenu}
      />
    </>
  );
}

export default MenuContainer;
