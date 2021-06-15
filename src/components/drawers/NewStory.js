import { useState, useEffect, useContext } from 'react';
import { Drawer, Form, Button, Col, Row, Input, message } from 'antd';
import { AppContext } from '../../stores/AppStore';
import AppLogicController from '../../controllers/AppLogicController';

const NewStory = ({ isDrawerVisible, onDrawerClose }) => {
  const [,dispatch] = useContext(AppContext);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [version, setVersion] = useState('');

  useEffect(() => {
    if(isDrawerVisible) { //opening drawer
      form.resetFields();
      openDrawer();
    }
  }, [isDrawerVisible, form]);

  const openDrawer = () => {
    setVisible(true);
  };

  const closeDrawer = () => {
    setVisible(false);
    onDrawerClose && onDrawerClose();
  };

  const onFinish = (values) => {
    const title = values.title.trim();
    const version = values.version.trim();
    if(title === '' || version === ''){
      closeDrawer();
      message.error('Something went wrong, sorry :(');
      return;
    }
    const data = {title, version};
    AppLogicController.createNewStory(dispatch, data).then(result => {
      closeDrawer();
      message.success('Story created!');
    }).catch(error => {
      closeDrawer();
      message.error('Something went wrong, sorry :(');
    });
  };

  return (
    <Drawer
      title="New story"
      width={360}
      onClose={closeDrawer}
      visible={visible}
      bodyStyle={{ paddingBottom: 20 }}
      footer={
        <div style={{textAlign: 'right'}} >
          <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" form='create-story-id'>
            Create
          </Button>
        </div>
      }
    >
      <Form layout="vertical" name='create-story' id='create-story-id' form={form} onFinish={onFinish} requiredMark={false}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Please enter a title' }]}
            >
              <Input placeholder="Please enter a title" value={title} onChange={(e) => { setTitle(e.target.value) }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="version"
              label="Version"
              rules={[{ required: true, message: 'Please enter a version' }]}
            >
              <Input placeholder="Please enter a version" value={version} onChange={(e) => { setVersion(e.target.value) }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default NewStory;
