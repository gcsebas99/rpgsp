import React, { useContext } from 'react';
import { Layout } from 'antd';
import AppNav from './components/AppNav';
import StoryTitle from './components/StoryTitle';
import EmptyProjectPage from './components/pages/EmptyProjectPage';
import ConfigPage from './components/pages/ConfigPage';
import StoryPage from './components/pages/StoryPage';
import { AppContext } from './stores/AppStore';

const AppLayout = () => {
  const [state] = useContext(AppContext);

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
