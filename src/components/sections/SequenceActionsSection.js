import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../stores/AppStore';
import AppLogicController from '../../controllers/AppLogicController';
import { Button, message, Row, Col, Card, Typography, List } from 'antd';
import { useLiveQuery } from 'dexie-react-hooks';
import EntitySelectorView from '../entity_views/EntitySelectorView';
import SequencedActionListItem from '../entity_views/SequencedActionListItem';
import AddEditSequencedAction from '../drawers/AddEditSequencedAction';
import AppDataFetchController from '../../controllers/AppDataFetchController';

const { Text } = Typography;

const SequenceActionsSection = ({ sectionActive }) => {
  const [,dispatch] = useContext(AppContext);
  const [characters, setCharacters] = useState(null);
  const [currentActId, setCurrentActId] = useState(null);
  const [currentSequencedAction, setCurrentSequencedAction] = useState(null);
  const [addEditSequencedActionVisible, setAddEditSequencedActionVisible] = useState(false);
  //live
  const act = useLiveQuery(AppDataFetchController.fetchLiveAct(currentActId), [currentActId]);
  const chapter = useLiveQuery(AppDataFetchController.fetchLiveChapter(act && act.chapter_id), [act]);
  const actSequencedActions = useLiveQuery(AppDataFetchController.fetchLiveSequencedActionsByAct(currentActId), [currentActId]);

  useEffect(() => {
    if (sectionActive) {
      loadCharacters();
      setCurrentActId(null);
    }
  }, [sectionActive]);

  const loadCharacters = () => {
    AppDataFetchController.fetchStoryEntities('character').then((characters) => {
      setCharacters(characters);
    }).catch(error => {
      setCharacters(null);
      console.log('||--FAIL', error);
    });
  };

  const selectCurrentAct = (actId) => {
    setCurrentActId(actId);
  };

  const addSequencedAction = () => {
    setCurrentSequencedAction(null);
    setAddEditSequencedActionVisible(true);
  };

  const editSequencedAction = (sequencedAction) => {
    setCurrentSequencedAction(sequencedAction);
    setAddEditSequencedActionVisible(true);
  };

  const removeSequencedAction = (sequencedAction) => {
    AppLogicController.deleteSequencedAction(dispatch, sequencedAction.id, sequencedAction.act_id).then(result => {
      message.success('Sequenced action removed!');
    }).catch(error => {
      message.error('Something went wrong, sorry :(');
    });
  };

  const moveSequencedActionUp = (sequencedAction) => {
    const orderInfo = {oldOrder: sequencedAction.order, order: sequencedAction.order - 1, actId: sequencedAction.act_id};
    AppLogicController.updateSequencedActionOrder(dispatch, sequencedAction.id, orderInfo).then(result => {
      //
    }).catch(error => {
      message.error('Something went wrong, sorry :(');
    });
  };

  const moveSequencedActionDown = (sequencedAction) => {
    const orderInfo = {oldOrder: sequencedAction.order, order: sequencedAction.order + 1, actId: sequencedAction.act_id};
    AppLogicController.updateSequencedActionOrder(dispatch, sequencedAction.id, orderInfo).then(result => {
      //
    }).catch(error => {
      message.error('Something went wrong, sorry :(');
    });
  };

  const actionsHeader = (
    <Row>
      <Col span={2}><Text strong>Order</Text></Col>
      <Col span={10}><Text strong>Text</Text></Col>
      <Col span={3}><Text strong>Type</Text></Col>
      <Col span={3}><Text strong>Character</Text></Col>
      <Col span={6} style={{textAlign: 'right'}}><Text strong>Options</Text></Col>
    </Row>
  );

  const renderActTitle = () => {
    let title = act && act.name;
    if(chapter) {
      title += ' (' + chapter.name + ')';
    }
    return title;
  };

  return (
    <div>
      <Row gutter={16}>
        <Col span={16}>
          <EntitySelectorView customFetch={sectionActive ? 'allSequencedActs' : null} value={currentActId} onChangeCallback={(e, n) => { selectCurrentAct(e); }} placeholder="Select an Act" />
        </Col>
        <Col span={8} style={{display: 'flex', justifyContent: 'flex-end'}}>
          <Button type='primary' onClick={addSequencedAction} disabled={currentActId === null}>
            Add Action
          </Button>
        </Col>
      </Row>
      {act && 
        <Card size='small' title={renderActTitle()} headStyle={{ background: '#f5f5f5'}} style={{marginTop: 20}}>
          {(actSequencedActions !== undefined && actSequencedActions.length > 0) 
            ?
            <List
              style={{marginBottom: '20px'}}
              header={actionsHeader}
              dataSource={actSequencedActions.sort((a, b) => { return a.order - b.order; })}
              renderItem={(item, index) => (
                <SequencedActionListItem
                  sequencedAction={item}
                  actionIndex={index}
                  totalActions={actSequencedActions.length}
                  characters={characters} 
                  onEditSequencedAction={() => { editSequencedAction(item) }} 
                  onRemoveSequencedAction={() => { removeSequencedAction(item) }}
                  onMoveSequencedActionUp={() => { moveSequencedActionUp(item) }} 
                  onMoveSequencedActionDown={() => { moveSequencedActionDown(item) }} 
                />
              )}
            />
            : 
            <Text>This act hasn't actions yet</Text>
          }
        </Card>
      }
      <AddEditSequencedAction 
        sequencedAction={currentSequencedAction}
        act={act}
        totalActions={actSequencedActions ? actSequencedActions.length : 0}
        isDrawerVisible={addEditSequencedActionVisible} 
        onDrawerClose={() => { setAddEditSequencedActionVisible(false); }} 
      />
    </div>
  );
};

export default SequenceActionsSection;
