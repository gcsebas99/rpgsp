import AppLayout from './AppLayout';
import AppStore from './stores/AppStore';
import './styles/AntDThemeConfig.less';
import './styles/App.scss';

const App = () => {
  return (
    <AppStore>
      <AppLayout />
    </AppStore>
  );
};

export default App;
