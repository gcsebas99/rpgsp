//-- Components --//
import React, { useEffect, useContext } from 'react';
import { Layout, Typography, Spin, Row, Col } from 'antd';
//-- Context --//
import { AppContext } from './stores/AppStore';
//-- Controller --//
import AppLogicController from './controllers/AppLogicController';
import AppDataFetchController from './controllers/AppDataFetchController';
//-- Modules --//
import GameRunner from './components/play_mode_modules/GameRunner';
import GameStatePropsInspector from './components/play_mode_modules/GameStatePropsInspector';
import MapView from './components/play_mode_modules/MapView';
import StoryProgress from './components/play_mode_modules/StoryProgress';
import Tools from './components/play_mode_modules/Tools';
//-- Images --//
import logo from './images/logo192.png';


const { Text } = Typography;

const PlayTestAppLayout = () => {
  const [state, dispatch] = useContext(AppContext);

  useEffect(() => {
    //Mount
    AppLogicController.checkDatabaseOk(dispatch);
    AppLogicController.checkStoryLoaded(dispatch);
    AppDataFetchController.loadRunConfigurations(dispatch);

  }, []); // eslint-disable-line

  if(!state.initialCheckDone || state.globalLoading) {
    return (
      <div className='play-test-app loading'>
        <img src={logo} alt='RPG Story Playtesting' />
        <Spin size='large' />
      </div>
    );
    
  }

  if(state.databaseLoadError) {
    return (
      <Text style={{display: 'block', textAlign: 'center', paddingTop: 50}}>
        This application requires IndexedDB. Please use a browser that supports this feature.
      </Text>
    );
  }

  if(state.storyLoadError) {
    return (
      <Text style={{display: 'block', textAlign: 'center', paddingTop: 50}}>
        We were unable to load your story, please go back to app editor and make sure your file/url contains a RPG-SP story.<br />
        {state.storyErrorMessage !== null && 'Error info: ' + state.storyErrorMessage}
      </Text>
    );
  }

  // let currentPage = null;
  // if(state.storyLoaded) {
  //   switch(state.page) {
  //     case 'PLAYMODE': currentPage = PlayModePage; break;
  //     case 'STORY': currentPage = StoryPage; break;
  //     case 'CONFIG': currentPage = ConfigPage; break;
  //     default: currentPage = ConfigPage; break;
  //   }
  // }
  

  return (
    <div className='play-test-app'>
      <Layout className='app-layout'>  
        <Row gutter={[16, 16]} className='layout-row'>
          <Col span={6} className='layout-col col-l'>
            <GameStatePropsInspector />
          </Col>
          <Col span={11} className='layout-col col-c'>
            <GameRunner />
          </Col>
          <Col span={7} className='layout-col col-r'>
            <Tools />
            <MapView />
            <StoryProgress />
          </Col>
        </Row>
      </Layout>
    </div>
  );
};

export default PlayTestAppLayout;
