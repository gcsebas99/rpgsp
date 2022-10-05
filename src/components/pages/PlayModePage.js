import { useState, useEffect, useContext } from 'react';
import { Layout, Tabs } from 'antd';
import { AppContext } from '../../stores/AppStore';
import { CloseCircleOutlined, CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import PlayActions from '../PlayActions';
import PlaytestConfigurationSection from '../sections/PlaytestConfigurationSection';
import StoryValidationSection from '../sections/StoryValidationSection';
import CustomizePlaytestSection from '../sections/CustomizePlaytestSection';
import '../../styles/components/pages/PlayModePage.scss';

const { Content } = Layout;
const { TabPane } = Tabs;

const PlayModePage = () => {
  const [state] = useContext(AppContext);
  const [shouldRenderTabTitle, setShouldRenderTabTitle] = useState(true);

  useEffect(() => {
    setShouldRenderTabTitle(false);
    setTimeout(() => {
      setShouldRenderTabTitle(true);
    }, 5);
  }, [state.storyVerifyingRunnable]);


  const renderValidationTabTitle = () => {
    let statusIcon;
    if (state.storyVerifyingRunnable) {
      statusIcon = <LoadingOutlined style={{marginLeft: 8}} />;
    } else {
      if (state.storyRunnable) {
        statusIcon = <CheckCircleOutlined style={{color: '#389e0d', marginLeft: 8}} />;
      } else {
        statusIcon = <CloseCircleOutlined style={{color: '#cf1322', marginLeft: 8}} />;
      }
    }
    return (
      <span>
        Story validation {statusIcon}
      </span>
    );
  };

  return (
    <>
      <PlayActions />
      <Content className='play-mode-page'>
        <Tabs type='card' size='small'>
          <TabPane tab="Playtest configuration" key="1">
            <PlaytestConfigurationSection />
          </TabPane>
          <TabPane tab={shouldRenderTabTitle && renderValidationTabTitle()} key="2">
            <StoryValidationSection />
          </TabPane>
          <TabPane tab="Customize playtest" key="3">
            <CustomizePlaytestSection />
          </TabPane>
        </Tabs>
      </Content>
    </>
  );
};

export default PlayModePage;
