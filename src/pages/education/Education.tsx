import { Button } from 'antd';
import ChildrenComponent from '@/pages/education/ChildrenComponent.tsx';

// 에듀케이션 테스트
const Education = (): React.ReactElement => {
  const [cnt, setCnt] = useState<number>(0);

  const fncPlusClick01 = () => {
    setCnt(cnt + 1);
  };

  return (
    <>
      <div>
        {`현재 값 : ${cnt}는 `}
        {cnt % 2 === 0 ? '짝수 ' : '홀수 '}
        <br />
        <Button type="primary" onClick={fncPlusClick01}>
          + 버튼
        </Button>
        <br />
        <br />
        <br />
        <div>
          <ChildrenComponent count={cnt} />
        </div>
      </div>
    </>
  );
};

export default Education;
