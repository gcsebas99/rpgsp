import { Row, Col, Card, Button, Typography, List, Popconfirm, Popover, message } from 'antd';
import { useState, useContext } from 'react';
import { AppContext } from '../../stores/AppStore';
import AppLogicController from '../../controllers/AppLogicController';
import { useLiveQuery } from 'dexie-react-hooks';
import AddEditSingleGameAction from '../drawers/AddEditSingleGameAction';
import AppDataFetchController from '../../controllers/AppDataFetchController';
import ConditionEditorUtils from '../../utils/ConditionEditorUtils';
import EffectsEditorUtils from '../../utils/EffectsEditorUtils';

const { Text } = Typography;

const InteractiveActionsSection = ({ sectionActive, onAddEditCondition, onAddEditEffects }) => {
  const [,dispatch] = useContext(AppContext);
  const [addEditSingleActionVisible, setAddEditSingleActionVisible] = useState(false);
  // const [characters, setCharacters] = useState(null);
  // const [currentActId, setCurrentActId] = useState(null);
  // const [currentSequencedAction, setCurrentSequencedAction] = useState(null);
  // const [addEditSequencedActionVisible, setAddEditSequencedActionVisible] = useState(false);
  //live
  const interactiveActions = useLiveQuery(AppDataFetchController.fetchLiveInteractiveActions({}));

  const addInteractiveAction = () => {
    setAddEditSingleActionVisible(true);
  };

  // const editInteractiveAction = (interactiveAction) => {
  //   // setCurrentNoEffectAction(noeffAction);
  //   // setAddEditSingleActionVisible(true);
  // };

  const removeInteractiveAction = (interactiveAction) => {
    AppLogicController.deleteInteractiveAction(dispatch, interactiveAction.id).then(result => {
      message.success('Action removed!');
    }).catch(error => {
      message.error('Something went wrong, sorry :(');
    });
  };

  const header = (
    <Row>
      <Col span={7}><Text strong>Required</Text></Col>
      <Col span={7}><Text strong>Description</Text></Col>
      <Col span={3}><Text strong>Effects</Text></Col>
      <Col span={1}><Text strong>Repeat?</Text></Col>
      <Col span={3}><Text strong>No-eff assoc?</Text></Col>
      <Col span={3}></Col>
    </Row>
  );

  return (
    <div>
      <Row gutter={[0, 8]} style={{paddingBottom: 24}}>
        <Col span={24}>
          <Card size='small'>
            <Button type='primary' onClick={addInteractiveAction} style={{ marginRight: 8 }}>
              Add Interactive Action
            </Button>
          </Card>
        </Col>
        <Col span={24}>
          <Card size='small'>
            Filters
          </Card>
        </Col>
        <Col span={24}>
          { (interactiveActions !== undefined && interactiveActions.length > 0) &&
            <List
              header={header}
              dataSource={interactiveActions}
              renderItem={interactiveAction => (
                <List.Item className='interactive-action-list-item'>
                  <Row style={{width: '100%'}}>
                    <Col span={7}><div>{ConditionEditorUtils.renderConditionDisplay(JSON.parse(interactiveAction.required_condition))}</div></Col>
                    <Col span={7}>{interactiveAction.description}</Col>
                    <Col span={3}>
                      <Popover content={EffectsEditorUtils.renderEffectsDisplay({display: JSON.parse(interactiveAction.effects_display)})} trigger="hover">
                        <Button size='small'>Effects</Button>
                      </Popover>
                    </Col>
                    <Col span={1}>{interactiveAction.allow_repeat ? 'Yes' : 'No'}</Col>
                    <Col span={3}>
                      {interactiveAction.assoc_no_eff &&
                        <Popover content={interactiveAction.assoc_no_eff.description} trigger="hover">
                          <Button size='small'>show</Button>
                        </Popover>
                      }
                    </Col>
                    <Col span={3} style={{textAlign: 'right'}}>
                      {/*  <Button type='link' size='small' onClick={() => { editInteractiveAction(interactiveAction) }}>Edit</Button> */}
                      <Popconfirm
                        title={`Are you sure you want to remove this action?`}
                        onConfirm={() => { removeInteractiveAction(interactiveAction) }}
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
        type='inter'
        isDrawerVisible={addEditSingleActionVisible} 
        onDrawerClose={() => { setAddEditSingleActionVisible(false); }} 
        onAddEditCondition={onAddEditCondition}
        onAddEditEffects={onAddEditEffects}
      />
    </div>
  );
};

export default InteractiveActionsSection;
