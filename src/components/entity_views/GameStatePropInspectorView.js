import { useState, useEffect } from 'react';
import TitledCard from '../ui/TitledCard';
import { PlusCircleFilled, MinusCircleFilled } from '@ant-design/icons';
import { Collapse, Descriptions } from 'antd';
import '../../styles/components/entity_views/GameStatePropInspectorView.scss';

const { Panel } = Collapse;
const { Item } = Descriptions;

const GameStatePropInspectorView = ({ gsProp, ...props }) => {
  const [extraOpen, setExtraOpen] = useState(false);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    //console.log('||--gsProp.value CHANGE', gsProp.value);
    pingUpdated();
  }, [gsProp.value]);

  const pingUpdated = () => {
    setUpdated(true);
    setTimeout(() => {
      setUpdated(false);
    }, 40);
  };

  const formatValue = (value, type) => {
    if (value === null || value === undefined) return '--empty--';
    let displayValue;
    if (type.endsWith('arr')) {
      displayValue = '[ ' + value + ' ]';
    } else {
      if(type === 'boolean') {
        displayValue = value ? 'true' : 'false';
      } else {
        displayValue = value;
      }
    }
    return displayValue;
  }; 

  return (
    <TitledCard 
      className={`game-state-prop-inspector-view ${updated ? 'updated' : ''}`}
      title={gsProp.name} 
      titleStyle={{fontSize: 13}} 
      style={{marginBottom: 12, borderColor: gsProp.color}}
      {...props}>
      <div style={{position: 'absolute', top: 4, right: 4, cursor: 'pointer'}} onClick={() => { setExtraOpen(!extraOpen) }}>
        {extraOpen ?
          <MinusCircleFilled style={{ fontSize: '14px', color: '#FFF' }} />
          :
          <PlusCircleFilled style={{ fontSize: '14px', color: '#FFF' }} />
        }
      </div>
      <p style={{fontWeight: 700, marginBottom: 6}}>{formatValue(gsProp.value, gsProp.type)}</p>
      <Collapse defaultActiveKey={['-']} activeKey={[extraOpen ? '1' : '-']} ghost>
        <Panel header={null} key="1" showArrow={false}>
          <Descriptions column={1} size="small">
            <Item label="Prev">{formatValue(gsProp.prev_value, gsProp.type)}</Item>
            <Item label="Type">{gsProp.type}</Item>
          </Descriptions>
        </Panel>
      </Collapse>
    </TitledCard>
  );
};

export default GameStatePropInspectorView;
