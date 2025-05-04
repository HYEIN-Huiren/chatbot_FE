import type { UploadFile, UploadProps } from 'antd/es/upload/interface';

export interface interfaceFileItem extends UploadProps {
  id: number;
  name: string;
}
