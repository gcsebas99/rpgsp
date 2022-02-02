import { useState, useEffect, useContext } from 'react';
import { Drawer, Form, Button, Col, Row, Input, Radio, Typography, message } from 'antd';
import { AppContext } from '../../stores/AppStore';
import AppLogicController from '../../controllers/AppLogicController';
import EntitySelectorView from '../entity_views/EntitySelectorView';

const { TextArea } = Input;
const { Text } = Typography;

const AddEditSequencedAction = ({ sequencedAction = null, act, totalActions = 0, isDrawerVisible, onDrawerClose }) => {
  const [,dispatch] = useContext(AppContext);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [actionIndex, setActionIndex] = useState(0);
  const [textValue, setTextValue] = useState('');
  const [sequencedActionType, setSequencedActionType] = useState('description'); // description || dialog
  const [characterId, setCharacterId] = useState(-1);
  
  useEffect(() => {
    if(isDrawerVisible) { //opening drawer
      form.resetFields();
      if (sequencedAction) {
        form.setFieldsValue({actionIndex: sequencedAction.order, textValue: sequencedAction.text_value, sequencedActionType: sequencedAction.type});
        setActionIndex(sequencedAction.order);
        setSequencedActionType(sequencedAction.type);
        if(sequencedAction.type === 'dialog') {
          setCharacterId(sequencedAction.character_id);
        }else{
          setCharacterId(-1);
        }
      } else {
        const index = totalActions + 1;
        form.setFieldsValue({actionIndex: index});
        setActionIndex(index);
        setSequencedActionType('description');
        setCharacterId(-1);
      }
      openDrawer();
    }
  }, [isDrawerVisible, form, sequencedAction, totalActions]);

  const openDrawer = () => {
    setVisible(true);
  };

  const closeDrawer = () => {
    setVisible(false);
    onDrawerClose && onDrawerClose();
  };

  const onFinish = (values) => {
    const textValue = values.textValue.trim();
    if(textValue === ''){
      message.error('Please provide some copy :(');
      return;
    }
    if(sequencedActionType === 'dialog' && characterId === -1){
      message.error('Dialog actions must have a character :(');
      return;
    }
    let data = {actId: act.id, order: actionIndex, textValue: textValue, type: sequencedActionType};
    if(sequencedActionType === 'dialog') {
      data.characterId = characterId;
    }else{
      data.characterId = -1;
    }
    if (sequencedAction === null) { //new sequenced action
      AppLogicController.createNewSequencedAction(dispatch, data).then(result => {
        closeDrawer();
        message.success('New sequenced action created!');
      }).catch(error => {
        closeDrawer();
        message.error('Something went wrong, sorry :(');
      });
    } else { //editing sequenced action
      AppLogicController.updateSequencedAction(dispatch, sequencedAction.id, data).then(result => {
        closeDrawer();
        message.success('Sequenced action edited!');
      }).catch(error => {
        closeDrawer();
        message.error('Something went wrong, sorry :(');
      });
    }
  };

  return (
    <Drawer
      title={(sequencedAction === null) ? 'New sequenced action' : 'Edit sequenced action'}
      width={360}
      onClose={closeDrawer}
      visible={visible}
      bodyStyle={{ paddingBottom: 20 }}
      footer={
        <div style={{textAlign: 'right'}} >
          <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" form='add-edit-sequenced-action-id'>
            {(sequencedAction === null) ? 'Create' : 'Update'}
          </Button>
        </div>
      }
    >
      <Form layout='vertical' name='add-edit-sequenced-action' id='add-edit-sequenced-action-id' form={form} onFinish={onFinish} requiredMark={false}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Order"
            >
              <Input placeholder="#" value={actionIndex} disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="textValue"
              label="Text"
              rules={[{ required: true, message: 'Please enter some text' }]}
            >
              <TextArea rows={10} placeholder="Please enter some text" value={textValue} onChange={(e) => { setTextValue(e.target.value) }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Type"
              initialValue='description'
            >
              <Radio.Group value={sequencedActionType} onChange={(e) => { setSequencedActionType(e.target.value) }} buttonStyle='solid'>
                <Radio.Button value='description'>Description</Radio.Button>
                <Radio.Button value='dialog'>Dialog</Radio.Button>
              </Radio.Group>
              <Text type='secondary' style={{display: 'block'}}>
                { (sequencedActionType === 'description') 
                  ? 'General description of any sequential event' 
                  : 'An PC or NPC dialog'
                }
              </Text>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} style={{display: ((sequencedActionType === 'dialog') ? 'block' : 'none')}}>
          <Col span={24}>
            <Form.Item
              label="Character"
            >
              <EntitySelectorView entityType={'character'} value={characterId} onChangeCallback={(e, n) => { setCharacterId(e); }} placeholder="Please select a character" emptyOption={true} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default AddEditSequencedAction;
