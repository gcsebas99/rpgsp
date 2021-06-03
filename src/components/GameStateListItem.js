import { List, Row, Col, Button, Popconfirm } from 'antd';
import '../styles/components/GameStateListItem.scss';

const GameStateListItem = ({
  gameState,
  onEditGameStateProp = () => {},
  onRemoveGameStateProp = () => {},
}) => {

  let defaultValue;
  if (gameState.type.endsWith('arr')) {
    defaultValue = '[ ' + gameState.default + ' ]';
  } else {
    defaultValue = gameState.default;
  }

  return (
    <List.Item className='game-state-list-item'>
      <Row>
        <Col span={6}>{gameState.name}</Col>
        <Col span={6}>{gameState.type}</Col>
        <Col span={8}>{defaultValue}</Col>
        <Col span={4} style={{textAlign: 'right'}}>
          {gameState.edit_mode !== 'none' &&
            <Button type='link' size='small' onClick={() => { onEditGameStateProp() }}>Edit</Button>
          }
          {gameState.removable &&
            <Popconfirm
              title={`Are you sure you want to remove this game state prop?`}
              onConfirm={() => { onRemoveGameStateProp() }}
              onCancel={() => {}}
              okText='Yes'
              cancelText='No'
              placement='bottomRight'
            >
              <Button type='link' size='small'>Remove</Button>
            </Popconfirm>
          }
        </Col>
      </Row>
    </List.Item>
  );
};

export default GameStateListItem;
