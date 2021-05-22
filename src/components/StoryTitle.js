import { Layout, Typography } from 'antd';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../db/AppDatabase';
import '../styles/components/StoryTitle.scss';

const { Header } = Layout;
const { Title, Text } = Typography;

const StoryTitle = () => {
  const story = useLiveQuery(() => db.stories.where('id').equals(1).first());

  if (story === undefined) return null;

  return (
    <Header className='story-title'>
      <Title level={5}>RPG-SP: {story.title}</Title>
      <Text type='secondary'>Version: {story.version}</Text>
    </Header>
  );
};

export default StoryTitle;
