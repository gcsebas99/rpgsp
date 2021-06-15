import { useState, useEffect, useContext } from 'react';
import { Drawer, Form, Button, Col, Row, Input, message } from 'antd';
import { AppContext } from '../../stores/AppStore';
import AppLogicController from '../../controllers/AppLogicController';

const { TextArea } = Input;

const AddEditCustomEntity = ({ entity = null, entityDef, isDrawerVisible, onDrawerClose }) => {
  const [,dispatch] = useContext(AppContext);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const singularCapitalized = entityDef.singular_name.toLowerCase().charAt(0).toUpperCase() + entityDef.singular_name.toLowerCase().slice(1);

  useEffect(() => {
    if(isDrawerVisible) { //opening drawer
      form.resetFields();
      if (entity) {
        form.setFieldsValue({name: entity.name, description: entity.description});
      }
      openDrawer();
    }
  }, [isDrawerVisible, form, entity]);

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
    let data = {name, description};
    if (entity === null) { //new entity
      data.custom_entity_def_id = entityDef.id;
      AppLogicController.createNewCustomEntity(dispatch, data).then(result => {
        closeDrawer();
        message.success('New ' + entityDef.singular_name.toLowerCase() + ' created!');
      }).catch(error => {
        closeDrawer();
        message.error('Something went wrong, sorry :(');
      });
    } else { //editing entity
      AppLogicController.updateCustomEntity(dispatch, entity.id, data).then(result => {
        closeDrawer();
        message.success(singularCapitalized + ' edited!');
      }).catch(error => {
        closeDrawer();
        message.error('Something went wrong, sorry :(');
      });
    }
  };

  return (
    <Drawer
      title={((entity === null) ? 'New' : 'Edit') + ' ' + entityDef.singular_name.toLowerCase()}
      width={360}
      onClose={closeDrawer}
      visible={visible}
      bodyStyle={{ paddingBottom: 20 }}
      footer={
        <div style={{textAlign: 'right'}} >
          <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" form={'add-edit-custom-entity-id-' + entityDef.key}>
            {(entity === null) ? 'Create' : 'Update'}
          </Button>
        </div>
      }
    >
      <Form layout='vertical' name={'add-edit-custom-entity-' + entityDef.key} id={'add-edit-custom-entity-id-' + entityDef.key} form={form} onFinish={(values) => { onFinish(values) }} requiredMark={false}>
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
      </Form>
    </Drawer>
  );
};

export default AddEditCustomEntity;
