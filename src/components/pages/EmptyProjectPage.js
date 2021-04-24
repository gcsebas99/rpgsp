import { Layout, Typography } from 'antd';
import jake_reading from '../../images/jake-reading.png';
import '../../styles/components/pages/EmptyProjectPage.scss';

const { Content } = Layout;
const { Text } = Typography;

const EmptyProjectPage = () => {

  return (
    <Content className='empty-project-page'>
      <img src={jake_reading} alt="Start a new story" />
      <Text>Create a new story or load an existing one</Text>
    </Content>
  );
};

export default EmptyProjectPage;
