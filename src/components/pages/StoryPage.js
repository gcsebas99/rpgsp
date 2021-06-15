import { Layout, Tabs } from 'antd';
import '../../styles/components/pages/StoryPage.scss';
import StorylineSection from '../sections/StorylineSection';

const { Content } = Layout;
const { TabPane } = Tabs;

const StoryPage = () => {

  return (
    <Content className='story-page'>
      <Tabs type='card' size='small'>
        <TabPane tab='Storyline' key='1'>
          <StorylineSection />
        </TabPane>
        <TabPane tab='Sequence Actions' key='2'>
          <p>Sequence Actions</p>
        </TabPane>
      </Tabs>
    </Content>
  );
};

export default StoryPage;
