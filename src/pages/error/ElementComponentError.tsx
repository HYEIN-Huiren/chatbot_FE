import { useRouteError } from 'react-router-dom';

function ElementComponentError(): React.ReactElement {
  const error: any = useRouteError();

  return (
    <div>
      <h1>
        현재 렌더링된 컴포넌트에 Error가 발생했습니다!
        <br />
        에러 내용 : {error?.message}
        <br />
        해당 컴포넌트를 다시 확인해주세요.
        <br />
      </h1>
    </div>
  );
}

export default ElementComponentError;
