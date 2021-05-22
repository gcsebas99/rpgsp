import { useLiveQuery } from 'dexie-react-hooks';
import db from '../../db/AppDatabase';
import GameStateListItem from '../GameStateListItem';
import { List, Row, Col, Typography } from 'antd';

const { Text } = Typography;

const GameStateConfigSection = () => {
  const gameStates = useLiveQuery(() => db.game_state_props.toArray());

  if (gameStates === undefined) return null;

  const header = (
    <Row>
      <Col span={6}><Text strong>Name</Text></Col>
      <Col span={6}><Text strong>Type</Text></Col>
      <Col span={6}><Text strong>Default</Text></Col>
      <Col span={6}></Col>
    </Row>
  );

  return (
    <div>
      <List
        header={header}
        dataSource={gameStates}
        renderItem={item => (
          <GameStateListItem gameState={item} />
        )}
      />
    </div>
  );
};

export default GameStateConfigSection;