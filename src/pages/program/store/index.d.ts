/**
 ***************************************************************************
 * @author junghwan.an
 * @version 0.1
 * @since 2023.11.02
 * @description: useStateStore의 변수 및 타입 선언
 *
 * 예시:) Program  -> store -> useStateStore 에서 사용할 지역의 전역 상태관리 변수 및 타입 선언
 *
 *
 ***************************************************************************
 * */
interface childenMenuType {
  children: [];
  menuId: string;
  menuLevel: string;
  menuNm: string;
  menuUrl: string;
}

export interface menuType extends childenMenuType {}

// 통신에 의한 결과값을 받기 위한 aciton 함수
interface actionInterface {
  Action: {
    setUserInfoObj: (payload: {}) => void;
    setJsonData: (payload: []) => void;
    setResetInit: () => void;
    setMenuArr: (payload: []) => void;
    setTestFileList: (payload: []) => void;
  };
}

// 결과값을 받는 변수 state
export interface stateInterface extends actionInterface {
  initUserInfoObj: {};
  jsonData: menuType[];
  menuArr: menuType[];
  testFileList: any[];
}
