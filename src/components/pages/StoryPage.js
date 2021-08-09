import { useState } from 'react';
import { Layout, Tabs } from 'antd';
import '../../styles/components/pages/StoryPage.scss';
import StorylineSection from '../sections/StorylineSection';
import ConditionEditor from '../drawers/ConditionEditor';

const { Content } = Layout;
const { TabPane } = Tabs;

const StoryPage = () => {
  const [conditionEditorVisible, setConditionEditorVisible] = useState(false);

  const addCondition = () => {
    setConditionEditorVisible(true);
  };

  // const editCondition = (condition) => {

  // };

  return (
    <>
      <Content className='story-page'>
        <Tabs type='card' size='small'>
          <TabPane tab='Storyline (Plot)' key='1'>
            <StorylineSection onAddCondition={() => { addCondition() }} />
          </TabPane>
          <TabPane tab='Sequence Actions' key='2'>
            <p>Sequence Actions</p>
          </TabPane>
        </Tabs>
      </Content>
      <ConditionEditor isDrawerVisible={conditionEditorVisible} onDrawerClose={() => { setConditionEditorVisible(false); }} />
    </>
  );
};

export default StoryPage;
