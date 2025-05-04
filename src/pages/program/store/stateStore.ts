/**
 ***************************************************************************
 * @author junghwan.an
 * @version 0.1
 * @since 2023.11.02
 * @description: stateStore
 *
 * globalStateInterface => 통신 결과값 상태를 받기 위한 변수 타입
 * actionInterface => 통신 하기 위한 변수 타입
 * initState => global state를 초기화 하기 위한 변수
 *
 *
 ***************************************************************************
 * */
import { create, createStore } from 'zustand';
import { type stateInterface } from '@/pages/program/store/index.ts';

// 전역 state 선언 및 초기화
const initState = {
  initUserInfoObj: {},
  jsonData: [],
  menuArr: [],
  testFileList: []
};

// 필요에 의해서 state , get 둘중 선택 하여 사용
const stateStore = create<stateInterface>((set, get) => ({
  ...initState,

  // 사용할 Action함수 정의 (전역 변수 선언 부분과 action 함수와 변별력을 주기 위해 Action으로 묶음)
  // 변수 : { ...state["globalState"] , ...payload }
  // ...state["globalState"] => 이미 클로저에 담겨 있는 값을 복사
  // ...payload => 통신 및 다른 로직에 의해 가져온 값을 추가로 복사
  Action: {
    setUserInfoObj: (payload) => {
      set((state) => ({
        initUserInfoObj: { ...payload } // Object.assign(state["initUserInfoObj"], { ...payload })
      }));
    },

    setJsonData: (payload) => {
      set((state) => ({
        jsonData: [...state.jsonData, ...payload]
      }));
    },

    setMenuArr: (payload) => {
      set((state) => ({
        menuArr: [...state.menuArr, ...payload]
      }));
    },

    setResetInit: () => {
      set({ ...initState });
    },

    setTestFileList: (payload) => {
      set((state) => ({
        testFileList: [...payload]
      }));
    }
  } // end Action()
}));

export default stateStore;
