interface childrenType {
  count: number;
}

const ChildrenComponent = (props: childrenType): React.ReactElement => {
  const { count } = props;
  const [plusThree, setPlusThree] = useState(3);

  useEffect(() => {
    setPlusThree(count + 3);
  }, [count]);

  return (
    <div
      style={{
        border: '1px solid black',
        width: '350px',
        margin: '20px'
      }}
    >
      <br />
      <h2>이 영역은 자식 컴포넌트 영역입니다.</h2>
      <br />
      <p>부모 컴포넌트에서 값을 받아 3을 더합니다.</p>
      <br />
      <p>{`합계 : ${plusThree}`}</p>
      <br />
    </div>
  );
};

export default ChildrenComponent;
