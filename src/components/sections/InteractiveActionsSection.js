import { Row, Col, Card, Button } from 'antd';
import { useState } from 'react';
// import { AppContext } from '../../stores/AppStore';
// import AppLogicController from '../../controllers/AppLogicController';
// import { Button, message, Row, Col, Card, Typography, List } from 'antd';
// import { useLiveQuery } from 'dexie-react-hooks';
// import EntitySelectorView from '../entity_views/EntitySelectorView';
// import SequencedActionListItem from '../entity_views/SequencedActionListItem';
import AddEditSingleGameAction from '../drawers/AddEditSingleGameAction';
// import AppDataFetchController from '../../controllers/AppDataFetchController';

// const { Text } = Typography;

const InteractiveActionsSection = ({ sectionActive }) => {
  // const [,dispatch] = useContext(AppContext);
  const [addEditSingleActionVisible, setAddEditSingleActionVisible] = useState(false);
  // const [characters, setCharacters] = useState(null);
  // const [currentActId, setCurrentActId] = useState(null);
  // const [currentSequencedAction, setCurrentSequencedAction] = useState(null);
  // const [addEditSequencedActionVisible, setAddEditSequencedActionVisible] = useState(false);
  // //live
  // const act = useLiveQuery(AppDataFetchController.fetchLiveAct(currentActId), [currentActId]);
  // const chapter = useLiveQuery(AppDataFetchController.fetchLiveChapter(act && act.chapter_id), [act]);
  // const actSequencedActions = useLiveQuery(AppDataFetchController.fetchLiveSequencedActionsByAct(currentActId), [currentActId]);

  const addInteractiveAction = () => {
    setAddEditSingleActionVisible(true);
  };

  return (
    <div>
      <Row gutter={[0, 8]} style={{paddingBottom: 24}}>
        <Col span={24}>
          <Card size='small'>
            <Button type='primary' onClick={addInteractiveAction} style={{ marginRight: 8 }}>
              Add Interactive Action
            </Button>
            <Button type='primary' onClick={() => {}}>
              Add Associated Interactive Action
            </Button>
          </Card>
        </Col>
        <Col span={24}>
          <Card size='small'>
            Filters
          </Card>
        </Col>
        <Col span={24}>
          <p>List of actions</p>
        </Col>
      </Row>
      <AddEditSingleGameAction 
        gameAction={null}
        type='inter'
        isDrawerVisible={addEditSingleActionVisible} 
        onDrawerClose={() => { setAddEditSingleActionVisible(false); }} 
      />
    </div>
  );
};

export default InteractiveActionsSection;