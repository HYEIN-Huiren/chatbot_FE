/**
 ***************************************************************************
 * @author junghwan.an
 * @version 0.1
 * @since 2023.11.02
 * @description: ProgramManagerPage
 *
 * 파일 업/다운로드 테스트
 *
 ***************************************************************************
 * */
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { type ReactNode } from 'react';
import callApi from '@/pages/program/api/callApi.ts';
import stateStore from '@/pages/program/store/stateStore.ts';
import { type interfaceFileItem } from '@/pages/program/ts/index.ts';

const ProgramManagerPage = (): ReactNode => {
  const action = callApi();
  const [messageApi, contextHolder] = message.useMessage();
  /// /////////////////  상태관리  /////////////////////////////////////////

  const FncStateCall = async (): Promise<void> => {
    await action.fncStateFileList({
      type: 'post',
      url: '/files/retrieveFileList',
      payload: {
        pageNumber: '1',
        pageSize: '10'
      }
    });
  };
  const FncStateReset = (): void => {
    action.fncResetInit();
  };
  /// /////////////////  파일 업&다운로드  ///////////////////////
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [fileGrpId, setFileGrpId] = useState<number>();
  const [deleteFiles, setDeleteFiles] = useState({});
  const [uploading, setUploading] = useState(false);
  const jsonData = stateStore((state) => state.jsonData);

  const testFileList = stateStore((state) => state.testFileList);

  useEffect(() => {
    setFileList(testFileList);
  }, [testFileList]);

  const fncFileList = async (): Promise<void> => {
    await action.fncFileList({ type: 'post' as Methods, url: '/files/retrieveFileList' });
  };

  useEffect(() => {
    fncFileList();
  }, []);

  const uploadFileCheck = (): boolean => {
    if (fileList.filter((val) => val.originFileObj).length === 0) {
      messageApi.open({
        type: 'warning',
        content: '업로드할 파일이 없습니다.'
      });

      return false;
    }
    return true;
  };

  /* 파일 업로드 */
  const fncFileUpload = async (): Promise<void> => {
    const isOk = await uploadFileCheck();
    if (isOk) {
      const formData = new FormData();
      fileList.forEach((file) => {
        // 새로 올린 파일 리스트만 업로드
        if (file.originFileObj) {
          formData.append('files', file.originFileObj);
        }
      });

      await action.fncFileUpload({
        type: 'post' as Methods,
        url: '/files/upload',
        payload: formData
      });
    }
  };

  /* 화면에서 파일 추가 */
  const handleChange: UploadProps['onChange'] = (info) => {
    // 기존에 뿌려진 파일 리스트 + 새로 올린 파일 리스트
    setFileList([...info.fileList]);
  };

  /* 파일 다운로드 */
  const fncFileDownLoad: UploadProps['onPreview'] = async (file): Promise<void> => {
    await action.fncFileDownLoad({
      type: 'post' as Methods,
      url: '/files/download',
      payload: file
    });
  };

  /* 화면에서 파일 제거 */
  const fncFileViewRemove: UploadProps['onPreview'] = (file: UploadFile | any) => {
    // 저장 버튼 누를 경우 deleteFileItem 객체 파라미터
    const deleteFileItem: Pick<interfaceFileItem, 'id'> = { id: 0 };
    deleteFileItem.id = file.id;
    setDeleteFiles({ ...deleteFileItem });

    // 화면에서만 지워져보이는 소스
    const index = fileList.indexOf(file);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    setFileList(newFileList);
  };

  const deleteFileCheck = (): boolean => {
    if (Object.keys(deleteFiles).length === 0) {
      messageApi.open({
        type: 'warning',
        content: '삭제할 파일을 선택해주세요.'
      });
      return false;
    }
    return true;
  };

  /* DB에서 파일 제거 */
  const fncFileDeleteSave = async (): Promise<void> => {
    const isOk = await deleteFileCheck();

    if (isOk) {
      await action.fncFileDelete({
        type: 'post' as Methods,
        url: '/files/delete',
        payload: deleteFiles
      });
    }
  };

  const fncAllFilesDownLoad = async () => {
    const localFileName = '압축파일테스트.zip';

    const FileItem: Pick<interfaceFileItem, 'id' | 'name'> = {
      id: fileGrpId ?? 7,
      name: localFileName
    };

    await action.fncAllFilesDownLoad({
      type: 'post' as Methods,
      url: '/files/zipDownload',
      payload: FileItem
    });
  };

  return (
    <div>
      <div>
        <h1>상태관리 테스트 영역</h1>
        {JSON.stringify(jsonData)}
        <br />
        <button type="button" onClick={FncStateCall}>
          상태관리가져오기
        </button>
        <button type="button" onClick={FncStateReset}>
          상태관리초기화
        </button>
      </div>

      <br />
      <div>
        <h1>파일다운/업로드 테스트 영역</h1>
        <Upload
          {...{
            name: 'fileUpload',
            multiple: true,
            progress: {
              strokeColor: {
                '0%': '#108ee9',
                '100%': '#87d068'
              },
              strokeWidth: 3,
              format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`
            },
            onChange: handleChange,
            onPreview: fncFileDownLoad,
            onRemove: fncFileViewRemove,
            beforeUpload: (file) => {
              setFileList([...fileList, file]);
              return false;
            },
            fileList
          }}
        >
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>

        <Button
          type="primary"
          onClick={fncFileUpload}
          loading={uploading}
          style={{ marginTop: 16 }}
        >
          {uploading ? 'Uploading' : 'Start Upload'}
        </Button>
        <Button onClick={fncFileDeleteSave}>파일삭제</Button>
        <Button onClick={fncAllFilesDownLoad}>zip다운로드</Button>
      </div>
    </div>
  );
};

export default ProgramManagerPage;
