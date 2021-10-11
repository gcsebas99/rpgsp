import PlayTestAppLayout from './PlayTestAppLayout';
import AppStore from './stores/AppStore';
import './styles/AntDDarkThemeConfig.less';
import './styles/PlayTestApp.scss';

const PlayTestApp = () => {
  return (
    <AppStore>
      <PlayTestAppLayout />
    </AppStore>
  );
};

export default PlayTestApp;
