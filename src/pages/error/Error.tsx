/**
 ***************************************************************************
 * @author junghwan.an
 * @version 0.1
 * @since 2023.07.25
 * @description: 404 Error Pages
 ***************************************************************************
 * */
import { Button } from 'antd';

const Error = (): React.ReactElement => {
  const nvg = useNavigate();

  const fncHome = () => {
    nvg('/', { replace: true });
  };

  return (
    <div>
      <h1>404 Not Found!</h1>
      <Button onClick={fncHome}>Home 으로 가기</Button>
    </div>
  );
};

export default Error;
