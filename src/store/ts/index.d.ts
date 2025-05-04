interface actionInterface {
  Action: {
    setIsLoading: (payload: boolean) => void;
    setUserInfo: (payload: {}) => void;
    setMenuInfo: (payload: []) => void;
  };
}

export interface globalStateInterface extends actionInterface {
  isLoading: boolean;
  userInfo: {};
  menuInfo: [];
}
