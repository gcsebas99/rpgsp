import { useState } from 'react';
import { Layout, Tabs, Button } from 'antd';
import '../../styles/components/pages/ConfigPage.scss';
import { PlusSquareOutlined } from '@ant-design/icons';
import AddCustomEntity from '../AddCustomEntity';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../../db/AppDatabase';
import GameStateConfigSection from '../sections/GameStateConfigSection';
import LocationConfigSection from '../sections/LocationConfigSection';
import CharacterConfigSection from '../sections/CharacterConfigSection';
import CustomEntityConfigSection from '../sections/CustomEntityConfigSection';

const { Content } = Layout;
const { TabPane } = Tabs;

const ConfigPage = () => {
  const [addCustomEntityVisible, setAddCustomEntityVisible] = useState(false);

  const customEntityDefs = useLiveQuery(() => db.custom_entity_defs.toArray());

  const addCustomEntityButton = <Button size='small' icon={<PlusSquareOutlined />} onClick={() => { setAddCustomEntityVisible(true); }}>Add custom entity</Button>;

  return (
    <>
      <Content className='config-page'>
        <Tabs type="card" size="small" tabBarExtraContent={addCustomEntityButton}>
          <TabPane tab="Game State" key="1">
            <GameStateConfigSection />
          </TabPane>
          <TabPane tab="Locations" key="2">
            <LocationConfigSection />
          </TabPane>
          <TabPane tab="Characters" key="3">
            <CharacterConfigSection />
          </TabPane>
          { customEntityDefs !== undefined && customEntityDefs.map((customEntityDef, index) =>
              <TabPane tab={customEntityDef.name} key={index + 4}>
                <CustomEntityConfigSection entityDef={customEntityDef} />
              </TabPane>
            )
          }
        </Tabs>
      </Content>
      <AddCustomEntity isDrawerVisible={addCustomEntityVisible} onDrawerClose={() => { setAddCustomEntityVisible(false); }} />
    </>
  );
};

export default ConfigPage;
