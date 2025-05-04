/**
 ***************************************************************************
 * @author junghwan.an
 * @version 0.1
 * @since 2023.08.23
 * @description: 파일 다운로드 유틸
 ***************************************************************************
 * */

// 파일 다운로드
export const fncFileDownLoadUtil = (fileName: string, data: any): void => {
  const url = window.URL.createObjectURL(new Blob([data], { type: 'image/png' }));
  const downLoad = document.createElement('a');
  downLoad.href = url;
  downLoad.download = fileName;
  document.body.appendChild(downLoad);
  downLoad.click();
  window.URL.revokeObjectURL(url);
};

// zip 파일 다운로드
export const fncZipFileDownLoadUtil = (fileName: string, data: any): void => {
  const url = window.URL.createObjectURL(new Blob([data], { type: 'application/octet-stream' }));
  const downLoad = document.createElement('a');
  downLoad.href = url;
  downLoad.download = fileName;
  document.body.appendChild(downLoad);
  downLoad.click();
  window.URL.revokeObjectURL(url);
};
