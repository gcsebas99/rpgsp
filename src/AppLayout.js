import React, { useEffect, useContext } from 'react';
import { Layout, Typography } from 'antd';
import AppNav from './components/AppNav';
import StoryTitle from './components/StoryTitle';
import EmptyProjectPage from './components/pages/EmptyProjectPage';
import ConfigPage from './components/pages/ConfigPage';
import StoryPage from './components/pages/StoryPage';
import { AppContext } from './stores/AppStore';
import { testDatabase } from './db/AppDatabase';

const { Text } = Typography;

const AppLayout = () => {
  const [state, dispatch] = useContext(AppContext);

  useEffect(() => {
    //Mount
    testDatabase(dispatch);
  }, []); // eslint-disable-line

  if(state.databaseLoadError){
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
