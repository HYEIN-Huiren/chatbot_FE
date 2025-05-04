/**
 ***************************************************************************
 * @author junghwan.an
 * @version 0.1
 * @since 2023.10.16
 * @description: globalState
 *
 * globalStateInterface => 통신 결과값 상태를 받기 위한 변수 타입
 * actionInterface => 통신 하기 위한 변수 타입
 * initState => global state를 초기화 하기 위한 변수
 *
 *
 ***************************************************************************
 * */
import { create } from 'zustand';
import { globalStateInterface } from '@/store/ts/index.ts';
import BrowserStorageUtil from '@/common/util/BrowserStorageUtil.ts';
// 전역 state 선언 및 초기화
const initState = {
  isLoading: false,
  userInfo: BrowserStorageUtil.getItem('USER_INFO') ?? {},
  menuInfo: BrowserStorageUtil.getItem('MENU_LIST') ?? []
};

// 필요에 의해서 state , get 둘중 선택 하여 사용
const globalStateStore = create<globalStateInterface>((set, get) => ({
  // ...initState,
  isLoading: false,
  userInfo: {}, // BrowserStorageUtil.getItem('USER_INFO') ??
  menuInfo: [], // BrowserStorageUtil.getItem('MENU_LIST') ??

  // 사용할 Action함수 정의 (전역 변수 선언 부분과 action 함수와 변별력을 주기 위해 Action으로 묶음)
  // 변수 : { ...state["globalState"] , ...payload }
  // ...state["globalState"] => 이미 클로저에 담겨 있는 값을 복사
  // ...payload => 통신 및 다른 로직에 의해 가져온 값을 추가로 복사
  Action: {
    setIsLoading: (payload) => set({ isLoading: payload }),

    setUserInfo: (payload) => {
      console.log('payload : ', payload);
      set(() => ({
        userInfo: { ...payload }
      }));
    },

    setMenuInfo: (payload) => {
      set(() => ({
        userInfo: [...payload]
      }));
    }
  } // end Action()
}));

export default globalStateStore;
