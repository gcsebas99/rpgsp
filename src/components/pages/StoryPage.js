import { useState } from 'react';
import { Layout, Tabs } from 'antd';
import '../../styles/components/pages/StoryPage.scss';
import StorylineSection from '../sections/StorylineSection';
import SequenceActionsSection from '../sections/SequenceActionsSection';
import NavigationActionsSection from '../sections/NavigationActionsSection';
import InteractiveActionsSection from '../sections/InteractiveActionsSection';
import NoEffectActionsSection from '../sections/NoEffectActionsSection';
import ConversationsSection from '../sections/ConversationsSection';
import ConditionEditor from '../drawers/ConditionEditor';

const { Content } = Layout;
const { TabPane } = Tabs;

const StoryPage = () => {
  const [conditionEditorVisible, setConditionEditorVisible] = useState(false);
  const [tab, setTab] = useState('1');

  const tabChange = (key) => {
    setTab(key);
  };

  const addEditCondition = () => {
    setConditionEditorVisible(true);
  };

  // const editCondition = (condition) => {

  // };

  return (
    <>
      <Content className='story-page'>
        <Tabs type='card' size='small' onChange={tabChange}>
          <TabPane tab='Storyline (Plot)' key='1'>
            <StorylineSection onAddEditCondition={() => { addEditCondition() }} />
          </TabPane>
          <TabPane tab='Sequenced Actions' key='2'>
            <SequenceActionsSection sectionActive={tab === '2'} />
          </TabPane>
          <TabPane tab='Navigation Actions' key='3'>
            <NavigationActionsSection sectionActive={tab === '3'} />
          </TabPane>
          <TabPane tab='Interactive Actions' key='4'>
            <InteractiveActionsSection sectionActive={tab === '4'} />
          </TabPane>
          <TabPane tab='No-Effect Actions' key='5'>
            <NoEffectActionsSection sectionActive={tab === '5'} onAddEditCondition={() => { addEditCondition() }} />
          </TabPane>
          <TabPane tab='Conversations' key='6'>
            <ConversationsSection sectionActive={tab === '6'} />
          </TabPane>
        </Tabs>
      </Content>
      <ConditionEditor isDrawerVisible={conditionEditorVisible} onDrawerClose={() => { setConditionEditorVisible(false); }} />
    </>
  );
};

export default StoryPage;
