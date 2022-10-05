import { useState, useEffect, useContext } from 'react';
import { Drawer, Form, Button, Col, Row, Input, message, Card, Typography, Switch, Radio } from 'antd';
import { AppContext } from '../../stores/AppStore';
import AppLogicController from '../../controllers/AppLogicController';
import ConditionEditorUtils from '../../utils/ConditionEditorUtils';
import EffectsEditorUtils from '../../utils/EffectsEditorUtils';
import NoEffectActionSelectorView from '../entity_views/NoEffectActionSelectorView';
import TitledCard from '../ui/TitledCard';

const { TextArea } = Input;
const { Title } = Typography;

const AddEditSingleGameAction = ({ gameAction = null, type = 'inter', isDrawerVisible, onDrawerClose, onAddEditCondition, onAddEditEffects = () => {} }) => {
  const [state, dispatch] = useContext(AppContext);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [requiredCondition, setRequiredCondition] = useState(null);
  const [actionEffects, setActionEffects] = useState(null);
  const [description, setDescription] = useState('');
  const [allowRepeat, setAllowRepeat] = useState(true);
  const [hasAssociatedNoEffAction, setHasAssociatedNoEffAction] = useState(false);
  const [associatedActionSelector, setAssociatedActionSelector] = useState('create');
  const [existingAssociatedAction, setExistingAssociatedAction] = useState(-1);

  useEffect(() => {
    if(isDrawerVisible) { //opening drawer
      dispatch({type: 'UNSET_ACTIVE_CONDITION'});
      form.resetFields();
      if (gameAction) {
        setAllowRepeat(gameAction.allow_repeat);
        form.setFieldsValue({allowRepeat: gameAction.allow_repeat, description: gameAction.description});
        setRequiredCondition(JSON.parse(gameAction.required_condition));
        if(type !== 'noeff') {
          setActionEffects({}); //TODO!! get effects and set here
        }
      } else {
        setAllowRepeat(true);
        setHasAssociatedNoEffAction(false);
        form.setFieldsValue({allowRepeat: true, description: ''});
        setRequiredCondition(null);
        setActionEffects(null);
      }
      openDrawer();
    }
  }, [isDrawerVisible, form, gameAction, dispatch]);

  useEffect(() => {
    if(state.activeConditionDone) {
      setRequiredCondition(state.activeCondition);
      console.log('||--activeCondition', state.activeCondition);
    }
  }, [state.activeConditionDone, state.activeCondition]);

  useEffect(() => {
    if(state.activeEffectsDone) {
      setActionEffects(state.activeEffects);
      console.log('||--activeEffects', state.activeEffects);
    }
  }, [state.activeEffectsDone, state.activeEffects]);


  const openDrawer = () => {
    setVisible(true);
  };

  const closeDrawer = () => {
    setVisible(false);
    onDrawerClose && onDrawerClose();
  };

  const changeCondition = () => {
    dispatch({type: 'SET_ACTIVE_CONDITION', payload: requiredCondition});
    onAddEditCondition();
  };

  const changeEffects = () => {
    dispatch({type: 'SET_ACTIVE_EFFECTS', payload: actionEffects});
    onAddEditEffects();
  };

  const onChangeAssociatedActionSelector = e => {
    setAssociatedActionSelector(e.target.value);
  };

  const onFinish = (values) => {
    const description = values.description.trim();
    if(description === ''){
      message.error('Please provide a valid description');
      return;
    }
    if(requiredCondition === null) {
      message.error('Please set a valid required condition');
      return;
    }
    if(type  !== 'noeff') {
      if(actionEffects === null) {
        message.error('Please set a valid effect(s)');
        return;
      }
    }
    if(type === 'inter' && hasAssociatedNoEffAction && associatedActionSelector === 'select') {
      if (existingAssociatedAction === -1){
        message.error('Please select a valid associated no-eff action');
        return;
      }
    }
    const data = {'description': description, allowRepeat: values.allowRepeat, requiredCondition: JSON.stringify(requiredCondition)};
    if(type  !== 'noeff') {
      data.actionEffects = actionEffects;
      data.actionEffects.json_display = JSON.stringify(data.actionEffects.display);
    }
    if(type === 'inter') {
      data.hasAssociated = hasAssociatedNoEffAction;
      if(hasAssociatedNoEffAction) {
        data.associationType = associatedActionSelector;
        data.associationTo = existingAssociatedAction;
      }
    }


    // console.log('||--data', data);
    // //return;
    if (type === 'noeff') {
      if (gameAction === null) { //new gameAction
        AppLogicController.createNewNoEffectAction(dispatch, data).then(result => {
          closeDrawer();
          message.success('New action created!');
        }).catch(error => {
          closeDrawer();
          message.error('Something went wrong, sorry :(');
        });
      } else { //editing gameAction
        AppLogicController.updateNoEffectAction(dispatch, gameAction.id, data).then(result => {
          closeDrawer();
          message.success('Action edited!');
        }).catch(error => {
          closeDrawer();
          message.error('Something went wrong, sorry :(');
        });
      }
    } else { //interactive
      if (gameAction === null) { //new gameAction
        AppLogicController.createNewInteractiveAction(dispatch, data).then(result => {
          closeDrawer();
          message.success('New action created!');
        }).catch(error => {
          closeDrawer();
          message.error('Something went wrong, sorry :(');
        });
      } else { //editing gameAction
        // AppLogicController.updateNoEffectAction(dispatch, gameAction.id, data).then(result => {
        //   closeDrawer();
        //   message.success('Action edited!');
        // }).catch(error => {
        //   closeDrawer();
        //   message.error('Something went wrong, sorry :(');
        // });
      }
    }
  };

  const renderActionTypeTitle = () => {
    let title = (gameAction === null) ? 'New ' : 'Edit ';
    title += (type === 'nav') ? 'navigation action' : ((type === 'noeff') ? 'no-effect action' : 'interactive action');
    return title;
  };

  const renderRequiredCondition = () => {
    const expressions = ConditionEditorUtils.renderConditionDisplay(requiredCondition);
    if(expressions !== null) {
      return (<div style={{paddingBottom: 20}}>{expressions}</div>);
    }
    return null;
  };

  const renderActionEffects = () => {
    const effects = EffectsEditorUtils.renderEffectsDisplay(actionEffects);
    if(effects !== null) {
      return (<div style={{paddingBottom: 20}}>{effects}</div>);
    }
    return null;
  };

  const renderEffectEditor = () => {
    // [inter - all except nav & timeline] <br />
    // [nav] - only currentArea (currentLocation changed auto)
    return (
      <Row gutter={16} style={{paddingBottom: 12}}>
        <Col span={24}>
          <TitledCard title={'Effects'} cfelement={false}>
            {renderActionEffects()}
            {actionEffects === null
              ? <Button type='primary' size='small' onClick={onAddEditEffects}>Add effects</Button>
              : <Button type='primary' size='small' onClick={changeEffects}>Change effects</Button>
            }
          </TitledCard>
        </Col>
      </Row>
    );
  };

  const renderAssociatedInverseNoEffAction = () => {
    return (
      <>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="hasAssociatedNoEffAction"
              label="Associated no-effect action (inverse):"
            >
              <Switch checkedChildren="Yes" unCheckedChildren="No" checked={hasAssociatedNoEffAction} onChange={(e) => { setHasAssociatedNoEffAction(e) }} />
            </Form.Item>
          </Col>
        </Row>
        {hasAssociatedNoEffAction &&
          <Row gutter={16}>
            <Col span={24}>
              <TitledCard title={'Associated no-eff action'} cfelement={false}>
                <Radio.Group onChange={onChangeAssociatedActionSelector} value={associatedActionSelector} style={{marginBottom: 12}}>
                  <Radio.Button value="create">Create action</Radio.Button>
                  <Radio.Button value="select">Select existing</Radio.Button>
                </Radio.Group>
                {associatedActionSelector === 'create'
                  ? <p>A no-eff action will be created with inverse required condition (please edit description later)</p>
                  : 
                    <>
                      <NoEffectActionSelectorView value={existingAssociatedAction} onChangeCallback={(v) => setExistingAssociatedAction(v)} emptyOption />
                      <p>Required condition for this no-effect action will be changed to opposite of this action's condition</p>
                    </>
                }
              </TitledCard>
            </Col>
          </Row>
        }
      </>
    );
  };

  return (
    <Drawer
      title={renderActionTypeTitle()}
      width={360}
      onClose={closeDrawer}
      visible={visible}
      bodyStyle={{ paddingBottom: 20 }}
      footer={
        <div style={{textAlign: 'right'}} >
          <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" form={'add-edit-gameaction-id-'+type}>
            {(gameAction === null) ? 'Create' : 'Update'}
          </Button>
        </div>
      }
    >
      <Form layout='vertical' name={'add-edit-gameaction-'+type} id={'add-edit-gameaction-id-'+type} form={form} onFinish={onFinish} requiredMark={false}>
        <Row gutter={16} style={{paddingBottom: 12}}>
          <Col span={24}>
            <Card size='small' className='low-padding border-title'>
              <Title level={5} type='secondary'>Required condition</Title>
              {renderRequiredCondition()}
              {requiredCondition === null
                ? <Button type='primary' size='small' onClick={onAddEditCondition}>Add condition</Button>
                : <Button type='primary' size='small' onClick={changeCondition}>Change condition</Button>
              }
            </Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please enter a description' }]}
            >
              <TextArea rows={10} placeholder="Please enter a description" value={description} onChange={(e) => { setDescription(e.target.value) }} />
            </Form.Item>
          </Col>
        </Row>
        {(type === 'nav' || type === 'inter') && renderEffectEditor()}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="allowRepeat"
              label="Can be repeated:"
            >
              <Switch checkedChildren="Yes" unCheckedChildren="No" checked={allowRepeat} onChange={(e) => { setAllowRepeat(e) }} />
            </Form.Item>
          </Col>
        </Row>
        {type === 'inter' && renderAssociatedInverseNoEffAction()}
      </Form>
    </Drawer>
  );
};

export default AddEditSingleGameAction;
