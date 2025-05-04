/**
 ***************************************************************************
 * @author junghwan.an
 * @version 0.1
 * @since 2023.11.02
 * @description: callApi
 *
 *  지역 상태관리 + 통신을 이용한 데이터 사용
 *
 ***************************************************************************
 * */
import axios from '@/apis/callApi.ts';
import stateStore from '@/pages/program/store/stateStore.ts';
import { fncFileDownLoadUtil, fncZipFileDownLoadUtil } from '@/common/util/FileDownLoadUtil.ts';

const callApi = () => {
  const { setJsonData, setTestFileList, setResetInit } = stateStore((state) => state.Action);
  const restApi = axios();

  /* 파일 리스트 */
  const fncFileList = async ({ type, url, payload }: apiInterface) => {
    const { data, isSuccess }: APIResponse = await restApi[type](url, payload)
      .then((response) => response.data)
      .catch((error) => {
        Promise.reject(error.response);
      });
    if (isSuccess) {
      setTestFileList(data);
    }
  };

  /* 상태관리 파일 리스트 */
  const fncStateFileList = async ({ type, url, payload }: apiInterface) => {
    const { data, isSuccess }: APIResponse = await restApi[type](url, payload)
      .then((response) => response.data)
      .catch((error) => {
        Promise.reject(error.response);
      });

    if (isSuccess) {
      setJsonData(data);
    }
  };

  /* 파일 삭제 */
  const fncFileDelete = async ({ type, url, payload }: apiInterface) => {
    const { isSuccess }: APIResponse = await restApi[type](url, payload)
      .then((response) => response.data)
      .catch((error) => {
        Promise.reject(error.response);
      });

    if (isSuccess) {
      const params = { type: 'post' as Methods, url: '/files/retrieveFileList', payload: {} };
      fncFileList(params);
    }
  };

  /* 파일 업로드 */
  const fncFileUpload = async ({ type, url, payload }: apiInterface) => {
    const conf = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
    const { isSuccess }: APIResponse = await restApi[type](url, payload, conf)
      .then((response) => response.data)
      .catch((error) => {
        Promise.reject(error.response);
      });
    if (isSuccess) {
      fncFileList({ type: 'post' as Methods, url: '/files/retrieveFileList', payload: {} });
    }
  };

  /* 파일 다운로드 */
  const fncFileDownLoad = async ({ type, url, payload }: apiInterface) => {
    const { isSuccess, data }: APIResponse = await restApi[type](url, payload, {
      responseType: 'blob'
    })
      .then((response) => response.data)
      .catch((error) => {
        Promise.reject(error.response);
      });
    if (isSuccess) {
      fncFileDownLoadUtil(payload.name, data);
    }
  };

  /* zip파일 다운로드 */
  const fncAllFilesDownLoad = async ({ type, url, payload }: apiInterface) => {
    const { isSuccess, data }: APIResponse = await restApi[type](url, payload, {
      responseType: 'blob'
    }).then((response) => response.data);

    if (isSuccess) {
      fncZipFileDownLoadUtil(payload.name, data);
    }
  };

  /* 상태관리 전체 리셋 */
  const fncResetInit = (): void => {
    setResetInit();
  };

  return {
    fncFileList,
    fncStateFileList,
    fncFileDelete,
    fncFileUpload,
    fncFileDownLoad,
    fncAllFilesDownLoad,
    fncResetInit
  };
};

export default callApi;
