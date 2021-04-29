import { useState } from 'react';
import { Layout, Tabs, Button } from 'antd';
import '../../styles/components/pages/ConfigPage.scss';
import { PlusSquareOutlined } from '@ant-design/icons';
import AddCustomEntity from '../AddCustomEntity';
import SimpleEntityView from '../SimpleEntityView';

const { Content } = Layout;
const { TabPane } = Tabs;

const ConfigPage = () => {
  const [addCustomEntityVisible, setAddCustomEntityVisible] = useState(false);

  const addCustomEntityButton = <Button size='small' icon={<PlusSquareOutlined />} onClick={() => { setAddCustomEntityVisible(true); }}>Add custom entity</Button>;

  return (
    <>
      <Content className='config-page'>
        <Tabs type="card" size="small" tabBarExtraContent={addCustomEntityButton}>
          <TabPane tab="Game State" key="1">
            Game State
          </TabPane>
          <TabPane tab="Locations" key="2">
            Locations
          </TabPane>
          <TabPane tab="Characters" key="3">
            <SimpleEntityView />
            <SimpleEntityView />
            <SimpleEntityView />
            <SimpleEntityView />
            <SimpleEntityView />
            <SimpleEntityView />
            <SimpleEntityView />
            <SimpleEntityView />
            <SimpleEntityView />
            <SimpleEntityView />
            <SimpleEntityView />
            <SimpleEntityView />
          </TabPane>
        </Tabs>
      </Content>
      <AddCustomEntity isDrawerVisible={addCustomEntityVisible} onDrawerClose={() => { setAddCustomEntityVisible(false); }} />
    </>
  );
};

export default ConfigPage;
