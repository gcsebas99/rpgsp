import { useState, useEffect } from 'react';
import { Drawer, Form, Button, Col, Row, Space, List, Typography, Tabs, Tag } from 'antd';
import { CaretLeftOutlined } from '@ant-design/icons';
//import { AppContext } from '../../stores/AppStore';
import ComplexConditionExpressionListItem from '../entity_views/ComplexConditionExpressionListItem';
import EditorUtils from '../../utils/EditorUtils';
//import AppLogicController from '../../controllers/AppLogicController';
import AppDataFetchController from '../../controllers/AppDataFetchController';
import ConditionEditorUtils from '../../utils/ConditionEditorUtils';
import '../../styles/components/drawers/ConditionEditor.scss';

const { TabPane } = Tabs;
const { Text } = Typography;
const conditionCaret = <CaretLeftOutlined key='caret' style={{color: '#fa541c'}} />;

const ConditionEditor = ({ condition = null, isDrawerVisible, onDrawerClose }) => {
  //const [,dispatch] = useContext(AppContext);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [conditionType, setConditionType] = useState('1'); //1 => single, 2 => complex
  //single expression
  const [singleExpression, setSingleExpression] = useState(EditorUtils.getEmptyExpression());

  //complex expression
  const [complexCondition, setComplexCondition] = useState([]);
  const [complexConditionExpressions, setComplexConditionExpressions] = useState([]);

  //GS props
  const [gameStates, setGameStates] = useState(undefined);

  useEffect(() => {
    //Mount
    AppDataFetchController.fetchGameStateProps().then((fetchedGameStateProps) => {
      setGameStates(fetchedGameStateProps);
    }).catch(error => {
      console.log('||--FAIL', error);
    });
  }, []); // eslint-disable-line

  useEffect(() => {
    if(isDrawerVisible) { //opening drawer


      //TODO: RESET VALUES


      form.resetFields();
      if (condition) {
        //set type accordingly
      } else {
        setConditionType('1');
      }
      openDrawer();
    }
  }, [isDrawerVisible, form, condition]);  // eslint-disable-line

  const openDrawer = () => {
    setVisible(true);
  };

  const closeDrawer = () => {
    setVisible(false);
    onDrawerClose && onDrawerClose();
  };

  //single cond
  const handleSingleCondGSPropChange = (value) => {
    const exp = singleExpression;
    const prop = gameStates[value];
    exp.gsProp = prop.name;
    exp.gsPropType = prop.type;
    exp.comp = null;
    exp.compId = null;
    exp.valueInputType = null;
    exp.value = null;
    setSingleExpression({ ...exp });
    form.setFieldsValue({singleCondComparator: ''});
  };

  const handleSingleCondComparatorChange = (value) => {
    const exp = singleExpression;
    exp.compId = value;
    exp.valueInputType = EditorUtils.getInputTypeForExpression(exp.gsPropType, exp.compId);
    setSingleExpression({ ...exp });
  };

  const handleSingleCondValueChange = (value) => {
    const exp = singleExpression;
    exp.value = value;
    setSingleExpression({ ...exp });
  };

  //complex condition expressions
  const handleComplexCondExpressionChange = (expression) => {
    const expressions = [...complexConditionExpressions];
    const index = expressions.findIndex(exp => exp.name === expression.name);
    expressions[index] = expression;
    setComplexConditionExpressions(expressions);
  };

  //complex condition buttons
  const complexConditionButtonClicked = (type) => {
    let newCondition = [...complexCondition];
    switch(type) {
      case 'ADD_EXP':
        const name = 'EXP' + (complexConditionExpressions.length + 1);
        const newExp = EditorUtils.getEmptyExpression(name);
        let newComplexConditionExpressions = [...complexConditionExpressions];
        newComplexConditionExpressions.push(newExp);
        newCondition.push({'type': 'exp', 'name': name, 'displayName': name});
        setComplexConditionExpressions(newComplexConditionExpressions);
        break;
      case 'AND':
        newCondition.push({'type': 'logic', 'name': 'AND', 'displayName': 'AND'});
        break;
      case 'OR':
        newCondition.push({'type': 'logic', 'name': 'OR', 'displayName': 'OR'});
        break;
      case 'NEG':
        newCondition.push({'type': 'logic', 'name': 'NEG', 'displayName': 'NEG'});
        break;
      case 'OPEN_GR':
        newCondition.push({'type': 'grouping', 'name': 'OPEN', 'displayName': '('});
        break;
      case 'CLOSE_GR':
        newCondition.push({'type': 'grouping', 'name': 'CLOSE', 'displayName': ')'});
        break;
      case 'DELETE':
        const removed = newCondition.pop();
        if(removed && removed.type === 'exp') {
          let newComplexConditionExpressions = [...complexConditionExpressions];
          newComplexConditionExpressions.pop();
          setComplexConditionExpressions(newComplexConditionExpressions);
        }
        break;
      case 'CLEAR':
        newCondition = [];
        setComplexConditionExpressions([]);
        break;
      default:
        break;
    }
    setComplexCondition(newCondition);
  };


  const onFinish = (values) => {
    // const name = values.name.trim();
    // const key = values.key.trim();
    // const singular = values.singular.trim();
    // if(name === '' || singular === ''){
    //   closeDrawer();
    //   message.error('Do not leave empty fields, sorry :(');
    //   return;
    // }
    // const data = {name, key, singular};
    // AppLogicController.createNewCustomEntityDef(dispatch, data).then(result => {
    //   closeDrawer();
    //   message.success('New entity created!');
    // }).catch(error => {
    //   closeDrawer();
    //   message.error('Something went wrong, sorry :(');
    // });
  };

  //renders
  const renderComplexConditionButtons = () => {
    return (
      <Space>
        <Button type='default' size='small' onClick={() => { complexConditionButtonClicked('ADD_EXP') }}>Expression</Button>
        <Button type='default' size='small' onClick={() => { complexConditionButtonClicked('AND') }}>AND</Button>
        <Button type='default' size='small' onClick={() => { complexConditionButtonClicked('OR') }}>OR</Button>
        <Button type='default' size='small' onClick={() => { complexConditionButtonClicked('NEG') }}>NEG</Button>
        <Button type='default' size='small' onClick={() => { complexConditionButtonClicked('OPEN_GR') }}>(</Button>
        <Button type='default' size='small' onClick={() => { complexConditionButtonClicked('CLOSE_GR') }}>)</Button>
        <Button type='default' size='small' onClick={() => { complexConditionButtonClicked('DELETE') }}>Delete</Button>
        <Button type='default' size='small' onClick={() => { complexConditionButtonClicked('CLEAR') }}>Clear</Button>
      </Space>
    );
  };

  const renderComplexCondition = () => {
    let complexConditionRender = complexCondition && complexCondition.map((element, index) => {
      let color = element.type === 'logic' ? '#52c41a' : (element.type === 'grouping' ? '#eb2f96' : '#1890ff');
      return (<Tag key={index} color={color}>{element.displayName || element.name}</Tag>);
    });
    complexConditionRender.push(conditionCaret);
    return complexConditionRender;
  };

  const complexConditionExpressionsHeader = (
    <Row>
      <Col span={4}><Text strong>Expression</Text></Col>
      <Col span={7}><Text strong>Game State Prop</Text></Col>
      <Col span={6}><Text strong>Comparator</Text></Col>
      <Col span={7}><Text strong>Value</Text></Col>
    </Row>
  );

  return (
    <Drawer
      title={(condition === null) ? 'New condition' : 'Edit condition'}
      className='condition-editor'
      placement='bottom'
      height={360}
      onClose={closeDrawer}
      visible={visible}
      bodyStyle={{ paddingBottom: 20 }}
      footer={
        <div style={{textAlign: 'right'}} >
          <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" style={{ marginRight: 8 }}>
            Validate
          </Button>
          <Button type="primary" htmlType="submit" form='add-edit-condition-id' disabled>
            {(condition === null) ? 'Create' : 'Update'}
          </Button>
        </div>
      }
    >
      <Form layout='vertical' name='add-edit-condition' id='add-edit-condition-id' form={form} onFinish={onFinish} requiredMark={false}>
        <Tabs tabPosition='left' activeKey={conditionType} onChange={(activeKey) => { setConditionType(activeKey); }}>
          <TabPane tab="Single" key="1">
            <Row gutter={[24, 16]}>
              <Col span={8}>
                <Form.Item
                  name="singleCondGSProp"
                  label="Game State Prop"
                  rules={[{ required: (conditionType === '1'), message: 'Please select a prop' }]}
                >
                  {ConditionEditorUtils.renderGameStatePropsSelector(singleExpression.gsProp, handleSingleCondGSPropChange, gameStates)}
                </Form.Item>
              </Col>
              <Col span={8} style={{display: (singleExpression.gsProp !== null ? 'block' : 'none')}}>
                <Form.Item
                  name="singleCondComparator"
                  label="Comparator"
                  rules={[{ required: (conditionType === '1'), message: 'Please select a comparator' }]}
                >
                  {ConditionEditorUtils.renderComparatorSelector(singleExpression.gsPropType, singleExpression.compId, handleSingleCondComparatorChange)}
                </Form.Item>
              </Col>
              <Col span={8} style={{display: (singleExpression.compId !== null && singleExpression.compId !== 'IS_EMPTY' ? 'block' : 'none')}}>
                <Form.Item
                  label="Value"
                >
                  {ConditionEditorUtils.renderValueSelector(singleExpression.gsPropType, singleExpression.valueInputType, singleExpression.value, handleSingleCondValueChange)}
                </Form.Item>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="Complex" key="2">
            <Row style={{marginBottom: 8}}>
              <Col span={24}>{renderComplexConditionButtons()}</Col>
            </Row>
            <Row style={{marginBottom: 16}}>
              <Col span={24}>
                <div className='condition-viewer'>
                  {renderComplexCondition()}
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                { (complexConditionExpressions.length > 0) &&
                  <List
                    style={{marginBottom: 16, maxWidth: '94%'}}
                    header={complexConditionExpressionsHeader}
                    dataSource={complexConditionExpressions}
                    renderItem={item => (
                      <ComplexConditionExpressionListItem
                        expression={item}
                        gameStates={gameStates}
                        onChange={handleComplexCondExpressionChange}
                      />
                    )}
                  />
                }
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Form>
    </Drawer>
  );
};

export default ConditionEditor;
