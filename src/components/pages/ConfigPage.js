import { Layout, Tabs, Button } from 'antd';
import '../../styles/components/pages/ConfigPage.scss';
import { PlusSquareOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { TabPane } = Tabs;

const addCustom = <Button size='small' icon={<PlusSquareOutlined />}>Add custom entity</Button>;

const ConfigPage = () => {

  return (
    <Content className='config-page'>
      <Tabs type="card" size="small" tabBarExtraContent={addCustom}>
        <TabPane tab="Game State" key="1">
          Game State
        </TabPane>
        <TabPane tab="Locations" key="2">
          Locations
        </TabPane>
        <TabPane tab="Characters" key="3">
          Characters
        </TabPane>
      </Tabs>
    </Content>
  );
};

export default ConfigPage;
