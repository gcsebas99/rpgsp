import { useState, useEffect, useContext } from 'react';
import { Drawer, Form, Button, Col, Row, Input, Radio, Typography, message } from 'antd';
import { AppContext } from '../../stores/AppStore';
import AppLogicController from '../../controllers/AppLogicController';

const { TextArea } = Input;
const { Text } = Typography;

const AddEditAct = ({ act = null, chapter = null, totalActs = 0, isDrawerVisible, onDrawerClose }) => {
  const [,dispatch] = useContext(AppContext);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [actIndex, setActIndex] = useState(0);
  const [actType, setActType] = useState('interactive');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if(isDrawerVisible) { //opening drawer
      form.resetFields();
      if (act) {
        form.setFieldsValue({name: act.name, description: act.description, actIndex: act.order, actType: act.type});
        setActIndex(act.order);
      } else {
        const index = totalActs + 1;
        form.setFieldsValue({actIndex: index});
        setActIndex(index);
      }
      setActType('interactive');
      openDrawer();
    }
  }, [isDrawerVisible, form, act, totalActs]);

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
    const data = {name, description, order: actIndex, chapter_id: chapter.id, type: actType};
    if (act === null) { //new act
      AppLogicController.createNewAct(dispatch, data).then(result => {
        closeDrawer();
        message.success('New act created!');
      }).catch(error => {
        closeDrawer();
        message.error('Something went wrong, sorry :(');
      });
    } else { //editing act
      AppLogicController.updateAct(dispatch, act.id, data).then(result => {
        closeDrawer();
        message.success('Act edited!');
      }).catch(error => {
        closeDrawer();
        message.error('Something went wrong, sorry :(');
      });
    }
  };

  return (
    <Drawer
      title={(act === null) ? 'New act' : 'Edit act'}
      width={360}
      onClose={closeDrawer}
      visible={visible}
      bodyStyle={{ paddingBottom: 20 }}
      footer={
        <div style={{textAlign: 'right'}} >
          <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" form='add-edit-act-id'>
            {(act === null) ? 'Create' : 'Update'}
          </Button>
        </div>
      }
    >
      <Form layout='vertical' name='add-edit-act' id='add-edit-act-id' form={form} onFinish={onFinish} requiredMark={false}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="actIndex"
              label="Act"
            >
              <Input placeholder="#" value={actIndex} disabled />
            </Form.Item>
          </Col>
        </Row>
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
        <Row gutter={16} style={{display: (act === null ? 'block' : 'none')}}>
          <Col span={24}>
            <Form.Item
              name="actType"
              label="Act type"
              initialValue='interactive'
            >
              <Radio.Group value={actType} onChange={(e) => { setActType(e.target.value) }} buttonStyle='solid'>
                <Radio.Button value='interactive'>Interactive</Radio.Button>
                <Radio.Button value='sequence'>Sequence</Radio.Button>
              </Radio.Group>
              <Text type='secondary' style={{display: 'block'}}>
                { (actType === 'interactive') 
                  ? 'Interactive act allows player to choose different actions while act\'s finished condition has not been accomplished' 
                  : 'Sequence act is used for predefined dialogs or fixed sequences (i.e. cinematics)' 
                }
              </Text>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default AddEditAct;
