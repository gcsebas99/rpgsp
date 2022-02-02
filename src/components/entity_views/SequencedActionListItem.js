import { List, Row, Col, Button, Popconfirm } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';

const SequencedActionListItem = ({
  sequencedAction,
  actionIndex,
  totalActions,
  characters,
  onEditSequencedAction = () => {},
  onRemoveSequencedAction = () => {},
  onMoveSequencedActionUp = () => {},
  onMoveSequencedActionDown = () => {},
}) => {

  const getCharacterName = (characterId) => {
    if (characterId === -1) {
      return '-';
    }
    if (characters) {
      return characters.find(character => character.id === characterId).name;
    }
    return characterId;
  };

  return (
    <List.Item>
      <Row style={{width: '100%'}}>
        <Col span={2}>{sequencedAction.order}</Col>
        <Col span={10}>{sequencedAction.text_value}</Col>
        <Col span={3}>{sequencedAction.type}</Col>
        <Col span={3}>{getCharacterName(sequencedAction.character_id)}</Col>
        <Col span={6} style={{textAlign: 'right'}}>
          <Button 
            type="default"
            icon={<CaretUpOutlined />} 
            size='small' style={{marginRight: '4px'}} 
            disabled={actionIndex === 0}
            onClick={onMoveSequencedActionUp} />
          <Button 
            type="default"  
            icon={<CaretDownOutlined />} 
            size='small' 
            style={{marginRight: '24px'}} 
            disabled={actionIndex === (totalActions - 1)}
            onClick={onMoveSequencedActionDown} />
          <Button type='link' size='small' onClick={() => { onEditSequencedAction() }}>Edit</Button>
          <Popconfirm
            title={`Are you sure you want to remove this action?`}
            onConfirm={() => { onRemoveSequencedAction() }}
            onCancel={() => {}}
            okText='Yes'
            cancelText='No'
            placement='bottomRight'
          >
            <Button type='link' size='small'>Remove</Button>
          </Popconfirm>
        </Col>
      </Row>
    </List.Item>
  );
};

export default SequencedActionListItem;
