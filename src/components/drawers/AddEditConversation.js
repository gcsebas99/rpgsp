import { useState, useEffect, useContext } from 'react';
import { Drawer, Form, Button, Col, Row, Input, message } from 'antd';
import { AppContext } from '../../stores/AppStore';
import AppLogicController from '../../controllers/AppLogicController';

const AddEditConversation = ({ conversation = null, isDrawerVisible, onDrawerClose }) => {
  const [,dispatch] = useContext(AppContext);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    if(isDrawerVisible) { //opening drawer
      form.resetFields();
      if (conversation) {
        form.setFieldsValue({name: conversation.name});
      }
      openDrawer();
    }
  }, [isDrawerVisible, form, conversation]);

  const openDrawer = () => {
    setVisible(true);
  };

  const closeDrawer = () => {
    setVisible(false);
    onDrawerClose && onDrawerClose();
  };

  const onFinish = (values) => {
    const name = values.name.trim();
    if(name === ''){
      message.error('Do not leave empty fields, sorry :(');
      return;
    }
    const data = {name};
    if (conversation === null) { //new conversation
      AppLogicController.createNewConversation(dispatch, data).then(result => {
        closeDrawer();
        message.success('New conversation created!');
      }).catch(error => {
        closeDrawer();
        message.error('Something went wrong, sorry :(');
      });
    } else { //editing conversation
      AppLogicController.updateConversation(dispatch, conversation.id, data).then(result => {
        closeDrawer();
        message.success('Conversation edited!');
      }).catch(error => {
        closeDrawer();
        message.error('Something went wrong, sorry :(');
      });
    }
  };

  return (
    <Drawer
      title={(conversation === null) ? 'New conversation' : 'Edit conversation'}
      width={360}
      onClose={closeDrawer}
      visible={visible}
      bodyStyle={{ paddingBottom: 20 }}
      footer={
        <div style={{textAlign: 'right'}} >
          <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" form='add-edit-conversation-id'>
            {(conversation === null) ? 'Create' : 'Update'}
          </Button>
        </div>
      }
    >
      <Form layout='vertical' name='add-edit-conversation' id='add-edit-conversation-id' form={form} onFinish={onFinish} requiredMark={false}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please enter a name' }]}
            >
              <Input placeholder="Please enter a name" value={name} onChange={(e) => { setName(e.target.value) }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default AddEditConversation;
