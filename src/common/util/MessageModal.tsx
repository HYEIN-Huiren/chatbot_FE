import { Modal } from 'antd';

type ModalType = 'success' | 'error' | 'warning' | 'info';
interface modalInterface {
  type: string;
  message: string;
}

export const MessageModal = ({ type, message }: modalInterface) => Modal[type as ModalType]({
  title: type,
  content: message
});
