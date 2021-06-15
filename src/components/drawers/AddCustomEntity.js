import { useState, useEffect, useContext } from 'react';
import { Drawer, Form, Button, Col, Row, Input, message } from 'antd';
import { AppContext } from '../../stores/AppStore';
import AppLogicController from '../../controllers/AppLogicController';

const AddCustomEntity = ({ isDrawerVisible, onDrawerClose }) => {
  const [,dispatch] = useContext(AppContext);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

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

  const onNameChange = (e) => {
    const key = e.target.value.toLowerCase().replace(/\s/g, '');
    form.setFieldsValue({key: key});
  };

  const onFinish = (values) => {
    const name = values.name.trim();
    const key = values.key.trim();
    const singular = values.singular.trim();
    if(name === '' || singular === ''){
      closeDrawer();
      message.error('Do not leave empty fields, sorry :(');
      return;
    }
    const data = {name, key, singular};
    AppLogicController.createNewCustomEntityDef(dispatch, data).then(result => {
      closeDrawer();
      message.success('New entity created!');
    }).catch(error => {
      closeDrawer();
      message.error('Something went wrong, sorry :(');
    });
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
          <Button type="primary" htmlType="submit" form='create-custom-entity-id'>
            Add
          </Button>
        </div>
      }
    >
      <Form layout="vertical" name='create-custom-entity' id='create-custom-entity-id' form={form} onFinish={onFinish} requiredMark={false}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Name (use plural)"
              rules={[{ required: true, message: 'Please enter a name' }]}
            >
              <Input placeholder="Please enter a name" onChange={onNameChange} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="key"
              label="Key"
            >
              <Input readOnly placeholder="" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="singular"
              label="Singular"
              rules={[{ required: true, message: 'Please enter singular entity name' }]}
            >
              <Input placeholder="Please enter singular entity name" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default AddCustomEntity;
