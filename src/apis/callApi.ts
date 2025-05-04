/**
 ***************************************************************************
 * @author junghwan.an
 * @version 0.1
 * @since 2023.11.02
 * @description: callApi
 *
 ***************************************************************************
 * */

import axios, {
  Axios,
  InternalAxiosRequestConfig as axiosReqConfig,
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
  HttpStatusCode
} from 'axios';
import BrowserStorageUtil from '@/common/util/BrowserStorageUtil.ts';
import { MessageModal } from '@/common/util/MessageModal.tsx';

const config: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_STD_FE_APP_URL,
  method: 'post',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Accept-Language': 'ko-KR'
  },
  timeout: 10000,
  responseType: 'json'
};

export const createNewInstance = (baseURL: string) => {
  const conf: AxiosRequestConfig = {
      baseURL: baseURL,
      method: "post",
      headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
          "Accept-Language": "ko-KR"
      },
      // timeout: 10000,
      responseType: "json" // 디폴트값은 json , 파일 관련 타입에 맞게  blob, stream, arraybuffe등 .. 로 변경 필요
  };
  return axios.create(conf);
};

const callApi = (): Axios => {
  const { setIsLoading } = globalStateStore((state) => state.Action);

  const $axios: Axios = axios.create(config);

  const fncInterceptorsRequest = (reqConfig: axiosReqConfig): axiosReqConfig => {
    setIsLoading(true);

    if (reqConfig.url?.includes('/auth/login')) {
      return reqConfig;
    }

    const accessToken = BrowserStorageUtil.getItem('ACCESSTOKEN_KEY');
    if (accessToken) {
      Object.assign(reqConfig.headers, {
        Authorization: `Bearer ${accessToken}`
      });
    }

    return reqConfig;
  };

  const fncInterceptorsResponse = (response: AxiosResponse<any>): AxiosResponse => {
    if (!response.data.isSuccess && response.data.isSuccess !== undefined) {
      MessageModal({
        type: 'error',
        message: response.data.message.description
      });
    } else if (response.data.type === 'application/octet-stream') {
      response.data.data = new Blob([response.data]);
      response.data.isSuccess = response.status === 200 ? 1 : 0;
    }
    setIsLoading(false);
    return response;
  };

  const fncInterceptorsRequestException = (error: AxiosError) => Promise.reject(error);

  const fncInterceptorsResponseException = async (error: AxiosError<any>) => {
    if (error?.response?.status === HttpStatusCode.Unauthorized) {
      return fncNewAccessToken(error.config);
    }
    if (error?.response?.status === HttpStatusCode.NotFound) {
      window.location.href = '/error';
    } else if (error?.response?.status === HttpStatusCode.InternalServerError) {
      const exp = error?.response?.data?.message ?? JSON.parse(await error?.response?.data?.text());
      MessageModal({
        type: 'error',
        message: exp.description ?? exp.message.description
      });
    } else if (error.code === AxiosError.ERR_NETWORK || error.code === AxiosError.ECONNABORTED) {
      fncMoveLoginPage();
    }
    setIsLoading(false);
    return error.response;
  };

  const fncNewAccessToken = async (originApiConfig: any): Promise<void> => {
    await $axios
      .post('/auth/refresh-token', {
        refreshToken: BrowserStorageUtil.getItem('REFRESHTOKEN_KEY')
      })
      .then(({ data }) => {
        BrowserStorageUtil.setItem('ACCESSTOKEN_KEY', data.data.accessToken);
        fncOriginApiCall(originApiConfig.url, originApiConfig.data);
      })
      .catch(() => {
        fncMoveLoginPage();
      });
  };

  const fncOriginApiCall = async (url: string, payload: any): Promise<void> => {
    await $axios
      .post(url, payload)
      .then(({ data }) => {
        Promise.resolve(data);
      })
      .catch((error: AxiosError) => {
        Promise.reject(error);
      });
  };

  const fncMoveLoginPage = (): void => {
    BrowserStorageUtil.clearItems();
    window.location.href = '/login';
  };

  $axios.interceptors.request.use(fncInterceptorsRequest, fncInterceptorsRequestException);
  $axios.interceptors.response.use(fncInterceptorsResponse, fncInterceptorsResponseException);

  return $axios;
};

export default callApi;
