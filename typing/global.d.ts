declare global {
  interface APP_INFO {
    pkg: {
      name: string;
      version: string;
      dependencies: Recordable<string>;
      devDependencies: Recordable<string>;
    };
    lastBuildTime: string;
    lastBuildTimeMs: number;
    envPrefix: string;
  }

  type Nullable<T> = T | null;
  type Recordable<T = any> = Record<string, T>;

  interface ViteEnv {
    [key: string]: any;
  }

  interface ChangeEvent extends Event {
    target: HTMLInputElement;
  }

  interface GenericType {
    [key: string]: any;
  }

  type Methods = 'head' | 'options' | 'put' | 'post' | 'patch' | 'delete' | 'get';

  interface loginResponse {
    accessToken?: [];
    refreshToken?: [];
    userInfo?: [];
    menuList?: [];
  }

  type APIResponse = {
    data: [] & loginResponse;
    isSuccess: boolean;
    message: {
      code: string;
      description: string;
      details: string;
    };
    totalPages: number;
  };

  interface interfaceFileDownParams {
    name: string;
  }

  interface apiInterface {
    type: Methods;
    url: string;
    payload?: object;
  }

  interface interfaceFileItem {
    id: number;
    name: string;
  }
}
export {};
