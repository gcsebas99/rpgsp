//-- Components --//
import React, { useEffect, useContext } from 'react';
import { Layout, Typography, Spin } from 'antd';
import AppNav from './components/AppNav';
import StoryTitle from './components/StoryTitle';
import EmptyProjectPage from './components/pages/EmptyProjectPage';
import ConfigPage from './components/pages/ConfigPage';
import StoryPage from './components/pages/StoryPage';
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
      <Text>This application requires IndexedDB. Please use a browser that supports this feature.</Text>
    );
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
                {React.createElement(state.page === 'CONFIG' ? ConfigPage : StoryPage)}
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
