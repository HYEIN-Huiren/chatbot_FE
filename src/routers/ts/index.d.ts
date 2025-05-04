export interface MenuObj {
  children: ChildrenMenu[];
  menuId: string;
  menuLevel: string;
  menuNm: string;
  menuUrl: string;
  parentMenuId: string;
}

export interface ChildrenMenu {
  children: [];
  menuId: string;
  menuLevel: string;
  menuNm: string;
  menuUrl: string;
  parentMenuId: string;
}

export interface ChildrenProps {
  index?: boolean;
  path: string;
  element: JSX.Element;
  errorElement: JSX.Element;
}
