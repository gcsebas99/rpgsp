import { useState, useEffect, useContext } from 'react';
import { Drawer, Form, Button, Col, Row, Input, message } from 'antd';
import { AppContext } from '../../stores/AppStore';
import AppLogicController from '../../controllers/AppLogicController';
import EntitySelectorView from '../entity_views/EntitySelectorView';

const { TextArea } = Input;

const AddEditConversationDialog = ({ dialog = null, conversation, totalDialogs = 0, isDrawerVisible, onDrawerClose }) => {
  const [,dispatch] = useContext(AppContext);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [dialogIndex, setDialogIndex] = useState(0);
  const [textValue, setTextValue] = useState('');
  const [characterId, setCharacterId] = useState(-1);
  
  useEffect(() => {
    if(isDrawerVisible) { //opening drawer
      form.resetFields();
      if (dialog) {
        form.setFieldsValue({dialogIndex: dialog.order, textValue: dialog.dialog});
        setDialogIndex(dialog.order);
        setCharacterId(dialog.character_id);
      } else {
        const index = totalDialogs + 1;
        form.setFieldsValue({dialogIndex: index});
        setDialogIndex(index);
        setCharacterId(-1);
      }
      openDrawer();
    }
  }, [isDrawerVisible, form, dialog, totalDialogs]);

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
      message.error('Please provide some copy for the dialog :(');
      return;
    }
    if(characterId === -1){
      message.error('Dialog must have a character :(');
      return;
    }
    let data = {conversationId: conversation.id, order: dialogIndex, dialog: textValue, characterId: characterId};
    if (dialog === null) { //new dialog
      AppLogicController.createNewConversationDialog(dispatch, data).then(result => {
        closeDrawer();
        message.success('New dialog created!');
      }).catch(error => {
        closeDrawer();
        message.error('Something went wrong, sorry :(');
      });
    } else { //editing dialog
      AppLogicController.updateConversationDialog(dispatch, dialog.id, data).then(result => {
        closeDrawer();
        message.success('Dialog edited!');
      }).catch(error => {
        closeDrawer();
        message.error('Something went wrong, sorry :(');
      });
    }
  };

  return (
    <Drawer
      title={(dialog === null) ? 'New dialog' : 'Edit dialog'}
      width={360}
      onClose={closeDrawer}
      visible={visible}
      bodyStyle={{ paddingBottom: 20 }}
      footer={
        <div style={{textAlign: 'right'}} >
          <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" form='add-edit-dialog-id'>
            {(dialog === null) ? 'Create' : 'Update'}
          </Button>
        </div>
      }
    >
      <Form layout='vertical' name='add-edit-dialog' id='add-edit-dialog-id' form={form} onFinish={onFinish} requiredMark={false}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Order"
            >
              <Input placeholder="#" value={dialogIndex} disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="textValue"
              label="Dialog"
              rules={[{ required: true, message: 'Please enter some text' }]}
            >
              <TextArea rows={10} placeholder="Please enter some text" value={textValue} onChange={(e) => { setTextValue(e.target.value) }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
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

export default AddEditConversationDialog;
