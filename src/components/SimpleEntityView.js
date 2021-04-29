import { Card, Typography } from 'antd';
//import '../styles/components/StoryTitle.scss';

const { Text } = Typography;

const SimpleEntityView = () => {

  return (
    <Card size='small' title='Paco Rabanon' extra={<a href="http://localhost:3000/#">Remove</a>} headStyle={{ background: '#f5f5f5'}} >
      <Text>Le pesaba el salchichon.</Text>
    </Card>
  );
};

export default SimpleEntityView;
