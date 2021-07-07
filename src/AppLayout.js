//-- Components --//
import React, { useEffect, useContext } from 'react';
import { Layout, Typography, Spin } from 'antd';
import AppNav from './components/AppNav';
import StoryTitle from './components/StoryTitle';
import EmptyProjectPage from './components/pages/EmptyProjectPage';
import ConfigPage from './components/pages/ConfigPage';
import StoryPage from './components/pages/StoryPage';
import PlayModePage from './components/pages/PlayModePage';
//-- Context --//
import { AppContext } from './stores/AppStore';
//-- Controller --//
import AppLogicController from './controllers/AppLogicController';
//-- Images --//
import logo from './images/logo192.png';


const { Text } = Typography;

const AppLayout = () => {
  const [state, dispatch] = useContext(AppContext);

  useEffect(() => {
    //Mount
    AppLogicController.checkDatabaseOk(dispatch);
    AppLogicController.checkStoryLoaded(dispatch);

  }, []); // eslint-disable-line

  if(!state.initialCheckDone) {
    return (
      <div className='app loading'>
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
        We were unable to load your story, please reload and make sure your file contains a RPG-SP story.<br />
        {state.storyErrorMessage !== null && 'Error info: ' + state.storyErrorMessage}
      </Text>
    );
  }

  let currentPage = null;
  if(state.storyLoaded) {
    switch(state.page) {
      case 'PLAYMODE': currentPage = PlayModePage; break;
      case 'STORY': currentPage = StoryPage; break;
      case 'CONFIG': currentPage = ConfigPage; break;
      default: currentPage = ConfigPage; break;
    }
  }
  

  return (
    <div className="app">
      <Layout>
        <AppNav />
        <Layout className="app-layout">
          {state.storyLoaded
            ?
              <>
                <StoryTitle />
                {React.createElement(currentPage)}
              </>
            : 
              <EmptyProjectPage />
          }
        </Layout>
        
      </Layout>
    </div>
  );
};

export default AppLayout;
