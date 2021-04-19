import React, { useState } from 'react';
import { Layout } from 'antd';
import AppNav from './components/AppNav';
import ConfigPage from './components/pages/ConfigPage';
import StoryPage from './components/pages/StoryPage';
import './styles/AntDThemeConfig.less';
import './styles/App.scss';

const App = () => {
  const [activePage, setActivePage] = useState('CONFIG');

  return (
    <div className="app">
      <Layout>
        <AppNav onNavChange={setActivePage} />
        <Layout className="app-layout">
          {React.createElement(activePage === 'CONFIG' ? ConfigPage : StoryPage)}
        </Layout>
      </Layout>
    </div>
  );
};

export default App;
