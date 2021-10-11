import { useState, useEffect, useContext } from 'react';
import { Drawer, Form, Button, Col, Row, Input, message } from 'antd';
import { AppContext } from '../../stores/AppStore';
import AppLogicController from '../../controllers/AppLogicController';
import ColorPicker from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';

const { TextArea } = Input;
const DefaultColor = '#00ff00';

const AddEditArea = ({ area = null, location, isDrawerVisible, onDrawerClose }) => {
  const [,dispatch] = useContext(AppContext);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(DefaultColor);

  useEffect(() => {
    if(isDrawerVisible) { //opening drawer
      form.resetFields();
      if (area) {
        form.setFieldsValue({name: area.name, description: area.description});
        setColor(area.color);
      } else {
        setColor(DefaultColor);
      }
      openDrawer();
    }
  }, [isDrawerVisible, form, area]);

  const openDrawer = () => {
    setVisible(true);
  };

  const closeDrawer = () => {
    setVisible(false);
    onDrawerClose && onDrawerClose();
  };

  const onFinish = (values) => {
    const name = values.name.trim();
    const description = values.description.trim();
    if(name === '' || description === ''){
      closeDrawer();
      message.error('Do not leave empty fields, sorry :(');
      return;
    }
    let data = {name, description, color};
    if (area === null) { //new area
      data.location_id = location.id;
      AppLogicController.createNewArea(dispatch, data).then(result => {
        closeDrawer();
        message.success('New area created!');
      }).catch(error => {
        closeDrawer();
        message.error('Something went wrong, sorry :(');
      });
    } else { //editing area
      AppLogicController.updateArea(dispatch, area.id, data).then(result => {
        closeDrawer();
        message.success('Area edited!');
      }).catch(error => {
        closeDrawer();
        message.error('Something went wrong, sorry :(');
      });
    }
  };

  return (
    <Drawer
      title={((area === null) ? 'New area' : 'Edit area') + ' in ' + (location && location.name)}
      width={360}
      onClose={closeDrawer}
      visible={visible}
      bodyStyle={{ paddingBottom: 20 }}
      footer={
        <div style={{textAlign: 'right'}} >
          <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" form='add-edit-area-id'>
            {(area === null) ? 'Create' : 'Update'}
          </Button>
        </div>
      }
    >
      <Form layout='vertical' name='add-edit-area' id='add-edit-area-id' form={form} onFinish={onFinish} requiredMark={false}>
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
          <Col span={18}>Color</Col>
          <Col span={6} style={{textAlign: 'right', marginBottom: 16}}>
            <ColorPicker
              animation='slide-up'
              placement='bottomRight'
              enableAlpha={false}
              color={color}
              onChange={(colors) => { setColor(colors.color) }}
            />
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default AddEditArea;
