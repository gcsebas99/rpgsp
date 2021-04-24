import { useState, useEffect } from 'react';
import { Drawer, Form, Button, Col, Row, Input } from 'antd';

const AddCustomEntity = ({ isDrawerVisible, onDrawerClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if(isDrawerVisible) { //opening drawer
      openDrawer();
    }
  }, [isDrawerVisible]);

  const openDrawer = () => {
    //TODO: reset form
    setVisible(true);
  };

  const closeDrawer = () => {
    setVisible(false);
    onDrawerClose && onDrawerClose();
  };

  return (
    <Drawer
      title="Add Custom Entity"
      width={360}
      onClose={closeDrawer}
      visible={visible}
      bodyStyle={{ paddingBottom: 20 }}
      footer={
        <div style={{textAlign: 'right'}} >
          <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button onClick={closeDrawer} type="primary">
            Add
          </Button>
        </div>
      }
    >
      <Form layout="vertical" hideRequiredMark>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Name (use plural)"
              rules={[{ required: true, message: 'Please enter user name' }]}
            >
              <Input placeholder="Please enter user name" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="key"
              label="Key"
              rules={[{ required: true, message: 'Please enter user name' }]}
            >
              <Input placeholder="Please enter user name" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="singular"
              label="Singular"
              rules={[{ required: true, message: 'Please enter user name' }]}
            >
              <Input placeholder="Please enter user name" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default AddCustomEntity;
