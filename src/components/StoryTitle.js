import { Layout, Typography } from 'antd';
import '../styles/components/StoryTitle.scss';

const { Header } = Layout;
const { Title, Text } = Typography;

const StoryTitle = () => {

  return (
    <Header className='story-title'>
      <Title level={5}>My Playable Story</Title>
      <Text type="secondary">Version: 0.1</Text>
    </Header>
  );
};

export default StoryTitle;
