import { useState, useEffect, useContext } from 'react';
import { Drawer, Form, Button, Col, Row, Input, Switch, message } from 'antd';
import { AppContext } from '../../stores/AppStore';
import AppLogicController from '../../controllers/AppLogicController';
import ColorPicker from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';

const { TextArea } = Input;
const DefaultColor = '#0000FF';

const AddEditCharacter = ({ character = null, isDrawerVisible, onDrawerClose }) => {
  const [,dispatch] = useContext(AppContext);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPC, setIsPC] = useState(false);
  const [color, setColor] = useState(DefaultColor);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if(isDrawerVisible) { //opening drawer
      form.resetFields();
      if (character) {
        form.setFieldsValue({name: character.name, description: character.description, isPC: character, image: character.image});
        setIsPC(character.is_pc);
        setColor(character.color);
      } else {
        form.setFieldsValue({isPC: false});
        setColor(DefaultColor);
      }
      openDrawer();
    }
  }, [isDrawerVisible, form, character]);

  const openDrawer = () => {
    setVisible(true);
  };

  const closeDrawer = () => {
    setVisible(false);
    onDrawerClose && onDrawerClose();
  };

  const isValidImage = (image) => {
    return !!image.match(/\w+\.(jpg|jpeg|png)$/gi);
  };

  const onFinish = (values) => {
    const name = values.name.trim();
    const description = values.description.trim();
    let image = values.image.trim();
    const isPC = values.isPC;
    if(name === '' || description === ''){
      message.error('Do not leave empty fields, sorry :(');
      return;
    }
    if(image && image.length > 0) {
      if(!isValidImage(image)) {
        message.error('Image does not appear to have a valid format :(');
        return;
      }
    } else {
      image = null;
    }
    const data = {name, description, isPC, color, image};
    if (character === null) { //new character
      AppLogicController.createNewCharacter(dispatch, data).then(result => {
        closeDrawer();
        message.success('New character created!');
      }).catch(error => {
        closeDrawer();
        message.error('Something went wrong, sorry :(');
      });
    } else { //editing character
      AppLogicController.updateCharacter(dispatch, character.id, data).then(result => {
        closeDrawer();
        message.success('Character edited!');
      }).catch(error => {
        closeDrawer();
        message.error('Something went wrong, sorry :(');
      });
    }
  };

  return (
    <Drawer
      title={(character === null) ? 'New character' : 'Edit character'}
      width={360}
      onClose={closeDrawer}
      visible={visible}
      bodyStyle={{ paddingBottom: 20 }}
      footer={
        <div style={{textAlign: 'right'}} >
          <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" form='add-edit-character-id'>
            {(character === null) ? 'Create' : 'Update'}
          </Button>
        </div>
      }
    >
      <Form layout='vertical' name='add-edit-character' id='add-edit-character-id' form={form} onFinish={onFinish} requiredMark={false}>
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
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="image"
              label="Image (optional)"
              rules={[{ required: false}]}
            >
              <Input placeholder="Enter image url (png/jpeg)" value={image} onChange={(e) => { setImage(e.target.value) }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="isPC"
              label="PC / NPC"
            >
              <Switch checkedChildren="PC" unCheckedChildren="NPC" checked={isPC} onChange={(e) => { setIsPC(e) }} />
            </Form.Item>
          </Col>
        </Row>

      </Form>
    </Drawer>
  );
};

export default AddEditCharacter;
