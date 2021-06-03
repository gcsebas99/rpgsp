import { useState } from 'react';
import { Layout, Tabs, Button } from 'antd';
import '../../styles/components/pages/ConfigPage.scss';
import { PlusSquareOutlined, BgColorsOutlined } from '@ant-design/icons';
import AddCustomEntity from '../AddCustomEntity';
import EditColors from '../EditColors';
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
  const [editColorsVisible, setEditColorsVisible] = useState(false);

  const customEntityDefs = useLiveQuery(() => db.custom_entity_defs.toArray());

  const addCustomEntityButton = <Button size='small' icon={<PlusSquareOutlined />} onClick={() => { setAddCustomEntityVisible(true); }}>Add entity</Button>;

  const colorsButton = <Button size='small' icon={<BgColorsOutlined />} style={{marginRight: '4px'}} onClick={() => { setEditColorsVisible(true); }}>Colors</Button>;

  const buttons = [colorsButton, addCustomEntityButton];

  return (
    <>
      <Content className='config-page'>
        <Tabs type="card" size="small" tabBarExtraContent={buttons}>
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
      <EditColors isDrawerVisible={editColorsVisible} onDrawerClose={() => { setEditColorsVisible(false); }} />
    </>
  );
};

export default ConfigPage;
