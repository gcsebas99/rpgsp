import { useState, useContext } from 'react';
import { AppContext } from '../../stores/AppStore';
import AppLogicController from '../../controllers/AppLogicController';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../../db/AppDatabase';
import GameStateListItem from '../entity_views/GameStateListItem';
import { List, Row, Col, Typography, Button, message } from 'antd';
import AddEditGameStateProp from '../drawers/AddEditGameStateProp';

const { Text } = Typography;

const GameStateConfigSection = () => {
  const [,dispatch] = useContext(AppContext);
  const [addEditGameStatePropVisible, setAddEditGameStatePropVisible] = useState(false);
  const [currentGameStateProp, setCurrentGameStateProp] = useState(null);

  const gameStates = useLiveQuery(() => db.game_state_props.toArray());

  const addGameStateProp = () => {
    setCurrentGameStateProp(null);
    setAddEditGameStatePropVisible(true);
  };

  const editGameStateProp = (gameStateProp) => {
    setCurrentGameStateProp(gameStateProp);
    setAddEditGameStatePropVisible(true);
  };

  const removeGameStateProp = (gameStateProp) => {
    AppLogicController.deleteGameStateProp(dispatch, gameStateProp.id).then(result => {
      message.success('Game state prop removed!');
    }).catch(error => {
      message.error('Something went wrong, sorry :(');
    });
  };

  const header = (
    <Row>
      <Col span={6}><Text strong>Name</Text></Col>
      <Col span={6}><Text strong>Type</Text></Col>
      <Col span={8}><Text strong>Default</Text></Col>
      <Col span={4}></Col>
    </Row>
  );

  return (
    <div>
      { (gameStates !== undefined && gameStates.length > 0) && 
        <List
          style={{marginBottom: '20px', maxWidth: '94%'}}
          header={header}
          dataSource={gameStates}
          renderItem={item => (
            <GameStateListItem
              gameState={item}
              onEditGameStateProp={() => { editGameStateProp(item); }} 
              onRemoveGameStateProp={() => { removeGameStateProp(item); }} 
            />
          )}
        />
      }
      <Button type='primary' onClick={addGameStateProp}>
        Add Game State Prop
      </Button>
      <AddEditGameStateProp
        gameStateProp={currentGameStateProp}
        isDrawerVisible={addEditGameStatePropVisible} 
        onDrawerClose={() => { setAddEditGameStatePropVisible(false); }} 
      />
    </div>
  );
};

export default GameStateConfigSection;