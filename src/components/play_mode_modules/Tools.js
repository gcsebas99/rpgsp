import { useState } from 'react';
import TitledCard from '../ui/TitledCard';
import { Button } from 'antd';
import { ControlOutlined } from '@ant-design/icons';
import PlayTestAppMenu from '../drawers/PlayTestAppMenu';

const Tools = () => {
  const [appMenuVisible, setAppMenuVisible] = useState(false);

  const openAppMenu = () => {
    setAppMenuVisible(true);
  };

  return (
    <TitledCard title={'Tools'} style={{marginBottom: 12, paddingBottom: 8}}>
      <Button type="primary" shape="circle" icon={<ControlOutlined />} onClick={openAppMenu} />
      <PlayTestAppMenu 
        isDrawerVisible={appMenuVisible} 
        onDrawerClose={() => { setAppMenuVisible(false); }} 
      />
    </TitledCard>
  );
};

export default Tools;
