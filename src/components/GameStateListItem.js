import { List, Row, Col } from 'antd';
import '../styles/components/GameStateListItem.scss';

const GameStateListItem = ({ gameState }) => {

  return (
    <List.Item className='game-state-list-item'>
      <Row>
        <Col span={6}>{gameState.name}</Col>
        <Col span={6}>{gameState.type}</Col>
        <Col span={6}>{gameState.default}</Col>
        <Col span={6}></Col>
      </Row>
    </List.Item>
  );
};

export default GameStateListItem;
