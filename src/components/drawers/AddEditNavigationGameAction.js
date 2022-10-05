import { useState, useEffect, useContext } from 'react';
import { Drawer, Form, Button, Col, Row, Input, message, Typography, Switch } from 'antd';
import { AppContext } from '../../stores/AppStore';
import AppLogicController from '../../controllers/AppLogicController';
import ConditionEditorUtils from '../../utils/ConditionEditorUtils';
import EffectsEditorUtils from '../../utils/EffectsEditorUtils';
import EntitySelectorView from '../entity_views/EntitySelectorView';
import TitledCard from '../ui/TitledCard';

const { TextArea } = Input;
const { Title } = Typography;

const AddEditNavigationGameAction = ({ navActionBuilder = null, gameActions = null, isDrawerVisible, onDrawerClose, onAddEditCondition, onAddEditEffects = () => {} }) => {
  const [state, dispatch] = useContext(AppContext);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  const [navBuilderEnabled, setNavBuilderEnabled] = useState(true);
  const [initialArea, setInitialArea] = useState(-1);
  const [initialAreaName, setInitialAreaName] = useState('');
  const [destinationArea, setDestinationArea] = useState(-1);
  const [destinationAreaName, setDestinationAreaName] = useState('');
  const [twoWayAction, setTwoWayAction] = useState(false);

  const [requiredConditionGoing, setRequiredConditionGoing] = useState(null);
  const [requiredConditionComing, setRequiredConditionComing] = useState(null);
  const [inEditCondition, setInEditCondition] = useState(null);
  const [descriptionGoing, setDescriptionGoing] = useState('');
  const [descriptionComing, setDescriptionComing] = useState('');
  const [allowRepeatGoing, setAllowRepeatGoing] = useState(true);
  const [allowRepeatComing, setAllowRepeatComing] = useState(true);
  const [actionEffectGoing, setActionEffectGoing] = useState(null);
  const [actionEffectComing, setActionEffectComing] = useState(null);


  useEffect(() => {
    if(isDrawerVisible) { //opening drawer
      dispatch({type: 'UNSET_ACTIVE_CONDITION'});
      form.resetFields();
      if (navActionBuilder) {
      //   setAllowRepeat(gameAction.allow_repeat);
      //   form.setFieldsValue({allowRepeat: gameAction.allow_repeat, description: gameAction.description});
      //   setRequiredCondition(JSON.parse(gameAction.required_condition));
      //   if(type !== 'noeff') {
      //     setActionEffects({}); //TODO!! get effects and set here
      //   }
      } else {
        setNavBuilderEnabled(true);
        setInitialArea(-1);
        setInitialAreaName('');
        setDestinationArea(-1);
        setDestinationAreaName('');
        setTwoWayAction(false);
      }
      openDrawer();
    }
  }, [isDrawerVisible, navActionBuilder, dispatch, form]);

  useEffect(() => {
    if(state.activeConditionDone) {
      if(inEditCondition === 'GOING') {
        setRequiredConditionGoing(state.activeCondition);
      } else {
        setRequiredConditionComing(state.activeCondition);
      }
      console.log('||--activeCondition', state.activeCondition);
    }
  }, [state.activeConditionDone, state.activeCondition, inEditCondition]);

  const openDrawer = () => {
    setVisible(true);
  };

  const closeDrawer = () => {
    setVisible(false);
    onDrawerClose && onDrawerClose();
  };

  const changeCondition = (requiredCondition, cond) => {
    setInEditCondition(cond);
    dispatch({type: 'SET_ACTIVE_CONDITION', payload: requiredCondition});
    dispatch({type: 'SET_ACTIVE_CONDITION_MODE', payload: 'NAV_ACTION'});
    onAddEditCondition();
  };

  const completeBuilderStep = () => {
    if(initialArea === -1 || destinationArea === -1){
      message.error('Please select both areas to continue');
      return;
    }
    if(initialArea === destinationArea){
      message.error('Please use different areas for initial and destination');
      return;
    }
    //create condition(s)/effect(s)
    setRequiredConditionGoing(ConditionEditorUtils.createNavigationBaseCondition(initialArea, initialAreaName));
    setActionEffectGoing(ConditionEditorUtils.createNavigationEffect(destinationArea, destinationAreaName));
    if(twoWayAction) {
      setRequiredConditionComing(ConditionEditorUtils.createNavigationBaseCondition(destinationArea, destinationAreaName));
      setActionEffectComing(ConditionEditorUtils.createNavigationEffect(initialArea, initialAreaName));
    }
    setNavBuilderEnabled(false);
  };

  const onFinish = (values) => {
    const descriptionGoing = values['description-going'].trim();
    let descriptionComing;
    let actions = [];
    if(descriptionGoing === ''){
      message.error('Please provide a valid description');
      return;
    }
    if(twoWayAction) {
      descriptionComing = values['description-coming'].trim();
      if(descriptionComing === ''){
        message.error('Please provide a valid description');
        return;
      }
    }
    const builderData = {
      area1: initialArea,
      area2: destinationArea,
      twoWay: twoWayAction,
    }
    actions.push({description: descriptionGoing, allowRepeat: allowRepeatGoing, requiredCondition: JSON.stringify(requiredConditionGoing), effects: actionEffectGoing.effects, effectsDisplay: JSON.stringify(actionEffectGoing.display)});
    if(twoWayAction) {
      actions.push({description: descriptionComing, allowRepeat: allowRepeatComing, requiredCondition: JSON.stringify(requiredConditionComing), effects: actionEffectComing.effects, effectsDisplay: JSON.stringify(actionEffectComing.display)});
    }
    const data = {builderData: builderData, actions: actions};

    if (navActionBuilder === null) { //new gameAction
      AppLogicController.createNavigationActions(dispatch, data).then(result => {
        closeDrawer();
        message.success('New action(s) created!');
      }).catch(error => {
        closeDrawer();
        message.error('Something went wrong, sorry :(');
      });
    } else { //editing
      // AppLogicController.updateNoEffectAction(dispatch, gameAction.id, data).then(result => {
      //   closeDrawer();
      //   message.success('Action edited!');
      // }).catch(error => {
      //   closeDrawer();
      //   message.error('Something went wrong, sorry :(');
      // });
    }
  };

  const renderTitle = () => {
    return (navActionBuilder === null) ? 'New navigation action' : 'Edit navigation action';
  };

  const renderNavPropsForGoingAction = () => {
    return (
      <>
        {twoWayAction && <Title level={5}>"Going" Action</Title>}
        <Row gutter={16} style={{paddingBottom: 12}}>
          <Col span={24}>
            <TitledCard title={'Additional required condition'} cfelement={false}>
              {renderRequiredCondition(requiredConditionGoing)}
              <Button type='primary' size='small' onClick={() => { changeCondition(requiredConditionGoing, 'GOING') }}>Edit condition</Button>
            </TitledCard>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="description-going"
              label="Description"
              rules={[{ required: true, message: 'Please enter a description' }]}
            >
              <TextArea rows={5} placeholder="Please enter a description. Use [A1] and [A2] for printing area name" value={descriptionGoing} onChange={(e) => { setDescriptionGoing(e.target.value) }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} style={{paddingBottom: 12}}>
          <Col span={24}>
            <TitledCard title={'Effect'} cfelement={false}>
              {renderActionEffects(actionEffectGoing)}
            </TitledCard>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="allowRepeat-going"
              label="Can be repeated:"
            >
              <Switch checkedChildren="Yes" unCheckedChildren="No" checked={allowRepeatGoing} onChange={(e) => { setAllowRepeatGoing(e) }} />
            </Form.Item>
          </Col>
        </Row>
      </>
    );
  };

  const renderNavPropsForComingAction = () => {
    return (
      <>
        <Title level={5}>"Coming Back" Action</Title>
        <Row gutter={16} style={{paddingBottom: 12}}>
          <Col span={24}>
            <TitledCard title={'Additional required condition'} cfelement={false}>
              {renderRequiredCondition(requiredConditionComing)}
              <Button type='primary' size='small' onClick={() => { changeCondition(requiredConditionComing, 'COMING') }}>Edit condition</Button>
            </TitledCard>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="description-coming"
              label="Description"
              rules={[{ required: true, message: 'Please enter a description' }]}
            >
              <TextArea rows={5} placeholder="Please enter a description. Use [A1] and [A2] for printing area name" value={descriptionComing} onChange={(e) => { setDescriptionComing(e.target.value) }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} style={{paddingBottom: 12}}>
          <Col span={24}>
            <TitledCard title={'Effect'} cfelement={false}>
              {renderActionEffects(actionEffectComing)}
            </TitledCard>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="allowRepeat-coming"
              label="Can be repeated:"
            >
              <Switch checkedChildren="Yes" unCheckedChildren="No" checked={allowRepeatComing} onChange={(e) => { setAllowRepeatComing(e) }} />
            </Form.Item>
          </Col>
        </Row>
      </>
    );
  };

  const renderRequiredCondition = (requiredCondition) => {
    const expressions = ConditionEditorUtils.renderConditionDisplay(requiredCondition);
    if(expressions !== null) {
      return (<div style={{paddingBottom: 20}}>{expressions}</div>);
    }
    return null;
  };

  const renderActionEffects = (actionEffect) => {
    const effects = EffectsEditorUtils.renderEffectsDisplay(actionEffect);
    if(effects !== null) {
      return (<div style={{paddingBottom: 20}}>{effects}</div>);
    }
    return null;
  };

  return (
    <Drawer
      title={renderTitle()}
      width={460}
      onClose={closeDrawer}
      visible={visible}
      bodyStyle={{ paddingBottom: 20 }}
      footer={
        <div style={{textAlign: 'right'}} >
          <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" form='add-edit-navgameaction-id' disabled={navBuilderEnabled}>
            {(navActionBuilder === null) ? 'Create' : 'Update'}
          </Button>
        </div>
      }
    >
      <Form layout='vertical' name='add-edit-navgameaction' id='add-edit-navgameaction-id' form={form} onFinish={onFinish} requiredMark={false}>
        <Row gutter={16}>
          <Col span={24}>
            <p>Please select initial area (A1) and destination area (A2). They cannot be the same.</p>
          </Col>
        </Row>
        <Row gutter={16} style={{paddingBottom: 12}}>
          <Col span={12}>
            <TitledCard title={'Initial'} cfelement={false}>
              <EntitySelectorView entityType='area' value={initialArea} onChangeCallback={(e, n) => { setInitialArea(e); setInitialAreaName(n); }} emptyOption={true} disabled={!navBuilderEnabled} />
            </TitledCard>
          </Col>
          <Col span={12}>
            <TitledCard title={'Destination'} cfelement={false}>
              <EntitySelectorView entityType='area' value={destinationArea} onChangeCallback={(e, n) => { setDestinationArea(e); setDestinationAreaName(n); }} emptyOption={true} disabled={!navBuilderEnabled} />
            </TitledCard>
          </Col>
        </Row>
        <Row gutter={16} style={{paddingBottom: 24}}>
          <Col span={24}>
            <Form.Item
              name="twoWayAction"
              label="Would you like to create a two-way action?"
            >
              <Switch checkedChildren="Yes" unCheckedChildren="No" checked={twoWayAction} onChange={(e) => { setTwoWayAction(e) }} disabled={!navBuilderEnabled} />
            </Form.Item>
            <Button type="primary" disabled={!navBuilderEnabled} onClick={completeBuilderStep}>
              Next
            </Button>
          </Col>
        </Row>
        {!navBuilderEnabled && renderNavPropsForGoingAction()}
        {(!navBuilderEnabled && twoWayAction) && renderNavPropsForComingAction()}
      </Form>
    </Drawer>
  );
};

export default AddEditNavigationGameAction;
