import { Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import CFElement from './CFElement';

const NextButton = ({ onClick }) => {
  return (
    <Button 
      type="primary" 
      block 
      icon={<ArrowRightOutlined />}
      onClick={onClick}
      style={{paddingTop: 30, paddingBottom: 30, height: 'auto'}}
    >
      <CFElement Element={'span'}>Next (n)</CFElement>
    </Button>
  );
};

export default NextButton;
