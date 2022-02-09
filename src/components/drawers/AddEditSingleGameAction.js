import { useState, useEffect, useContext } from 'react';
import { Drawer, Form, Button, Col, Row, Input, message, Card, Typography, Switch } from 'antd';
import { AppContext } from '../../stores/AppStore';
import AppLogicController from '../../controllers/AppLogicController';
import ConditionEditorUtils from '../../utils/ConditionEditorUtils';

const { TextArea } = Input;
const { Title } = Typography;

const AddEditSingleGameAction = ({ gameAction = null, type = 'inter', isDrawerVisible, onDrawerClose, onAddEditCondition }) => {
  const [state, dispatch] = useContext(AppContext);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [requiredCondition, setRequiredCondition] = useState(null);
  const [description, setDescription] = useState('');
  const [allowRepeat, setAllowRepeat] = useState(true);

  useEffect(() => {
    if(isDrawerVisible) { //opening drawer
      dispatch({type: 'UNSET_ACTIVE_CONDITION'});
      form.resetFields();
      if (gameAction) {
        setAllowRepeat(gameAction.allow_repeat);
        form.setFieldsValue({allowRepeat: gameAction.allow_repeat, description: gameAction.description});
        setRequiredCondition(JSON.parse(gameAction.required_condition));
      } else {
        setAllowRepeat(true);
        form.setFieldsValue({allowRepeat: true, description: ''});
        setRequiredCondition(null);
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
    const data = {'description': description, allowRepeat: values.allowRepeat, requiredCondition: JSON.stringify(requiredCondition)};
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
          <Button type="primary" htmlType="submit" form='add-edit-gameaction-id'>
            {(gameAction === null) ? 'Create' : 'Update'}
          </Button>
        </div>
      }
    >
      <Form layout='vertical' name='add-edit-gameaction' id='add-edit-gameaction-id' form={form} onFinish={onFinish} requiredMark={false}>
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
      </Form>
    </Drawer>
  );
};

export default AddEditSingleGameAction;
