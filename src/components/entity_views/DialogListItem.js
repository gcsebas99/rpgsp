import { List, Row, Col, Button, Popconfirm } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';

const DialogListItem = ({
  dialog,
  dialogIndex,
  totalDialogs,
  characters,
  onEditDialog = () => {},
  onRemoveDialog = () => {},
  onMoveDialogUp = () => {},
  onMoveDialogDown = () => {},
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
        <Col span={2}>{dialog.order}</Col>
        <Col span={13}>{dialog.dialog}</Col>
        <Col span={3}>{getCharacterName(dialog.character_id)}</Col>
        <Col span={6} style={{textAlign: 'right'}}>
          <Button 
            type="default"
            icon={<CaretUpOutlined />} 
            size='small' style={{marginRight: '4px'}} 
            disabled={dialogIndex === 0}
            onClick={onMoveDialogUp} />
          <Button 
            type="default"  
            icon={<CaretDownOutlined />} 
            size='small' 
            style={{marginRight: '24px'}} 
            disabled={dialogIndex === (totalDialogs - 1)}
            onClick={onMoveDialogDown} />
          <Button type='link' size='small' onClick={() => { onEditDialog() }}>Edit</Button>
          <Popconfirm
            title={`Are you sure you want to remove this dialog?`}
            onConfirm={() => { onRemoveDialog() }}
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

export default DialogListItem;
