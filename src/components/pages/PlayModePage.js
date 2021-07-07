import { Layout } from 'antd';
import '../../styles/components/pages/PlayModePage.scss';

const { Content } = Layout;

const PlayModePage = () => {

  return (
    <Content className='play-mode-page'>
      <ul>
        <li>Required conditions to run</li>
        <li>Launch game experience (separate page)</li>
      </ul>
    </Content>
  );
};

export default PlayModePage;
