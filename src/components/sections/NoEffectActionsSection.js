import { Row, Col, Card, Button, List, Typography, Popconfirm, message } from 'antd';
import { useState, useContext } from 'react';
import { AppContext } from '../../stores/AppStore';
import AppLogicController from '../../controllers/AppLogicController';
import { useLiveQuery } from 'dexie-react-hooks';
// import EntitySelectorView from '../entity_views/EntitySelectorView';
// import SequencedActionListItem from '../entity_views/SequencedActionListItem';
import AddEditSingleGameAction from '../drawers/AddEditSingleGameAction';
import AppDataFetchController from '../../controllers/AppDataFetchController';
import ConditionEditorUtils from '../../utils/ConditionEditorUtils';

const { Text } = Typography;

const NoEffectActionsSection = ({ sectionActive, onAddEditCondition }) => {
  const [,dispatch] = useContext(AppContext);
  const [addEditSingleActionVisible, setAddEditSingleActionVisible] = useState(false);
  // const [characters, setCharacters] = useState(null);
  // const [currentActId, setCurrentActId] = useState(null);
  // const [currentSequencedAction, setCurrentSequencedAction] = useState(null);
  // const [addEditSequencedActionVisible, setAddEditSequencedActionVisible] = useState(false);
  // //live
  // const act = useLiveQuery(AppDataFetchController.fetchLiveAct(currentActId), [currentActId]);
  // const chapter = useLiveQuery(AppDataFetchController.fetchLiveChapter(act && act.chapter_id), [act]);
  // const actSequencedActions = useLiveQuery(AppDataFetchController.fetchLiveSequencedActionsByAct(currentActId), [currentActId]);
  //live
  const noeffActions = useLiveQuery(AppDataFetchController.fetchLiveNoEffectActions({}));

  const addNoEffectAction = () => {
    setAddEditSingleActionVisible(true);
  };

  const editNoEffectAction = () => {
    //setAddEditSingleActionVisible(true);
  };

  const removeNoEffectAction = (noeffAction) => {
    AppLogicController.deleteNoEffectAction(dispatch, noeffAction.id).then(result => {
      message.success('Action removed!');
    }).catch(error => {
      message.error('Something went wrong, sorry :(');
    });
  };

  const header = (
    <Row>
      <Col span={10}><Text strong>Required</Text></Col>
      <Col span={10}><Text strong>Description</Text></Col>
      <Col span={1}><Text strong>Repeat?</Text></Col>
      <Col span={3}></Col>
    </Row>
  );

  return (
    <div>
      <Row gutter={[0, 8]} style={{paddingBottom: 24}}>
        <Col span={24}>
          <Card size='small'>
            <Button type='primary' onClick={addNoEffectAction}>
              Add No-effect Action
            </Button>
          </Card>
        </Col>
        <Col span={24}>
          <Card size='small'>
            Filters
          </Card>
        </Col>
        <Col span={24}>
          { (noeffActions !== undefined && noeffActions.length > 0) &&
            <List
              header={header}
              dataSource={noeffActions}
              renderItem={noeffAction => (
                <List.Item className='noeff-action-list-item'>
                  <Row style={{width: '100%'}}>
                    <Col span={10}><div>{ConditionEditorUtils.renderConditionDisplay(JSON.parse(noeffAction.required_condition))}</div></Col>
                    <Col span={10}>{noeffAction.description}</Col>
                    <Col span={1}>{noeffAction.allow_repeat ? 'Yes' : 'No'}</Col>
                    <Col span={3} style={{textAlign: 'right'}}>
                      <Button type='link' size='small' onClick={() => { editNoEffectAction(noeffAction) }}>Edit</Button>
                      <Popconfirm
                        title={`Are you sure you want to remove this action?`}
                        onConfirm={() => { removeNoEffectAction(noeffAction) }}
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
              )}
            />
          }
        </Col>
      </Row>
      <AddEditSingleGameAction 
        gameAction={null}
        type='noeff'
        isDrawerVisible={addEditSingleActionVisible} 
        onDrawerClose={() => { setAddEditSingleActionVisible(false); }} 
        onAddEditCondition={onAddEditCondition}
      />
    </div>
  );
};

export default NoEffectActionsSection;
