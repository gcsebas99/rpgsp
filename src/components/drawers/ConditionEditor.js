import { useState, useEffect, useContext } from 'react';
import { Drawer, Form, Button, Col, Row, Space, List, Typography, Tabs, Tag } from 'antd';
import { CaretLeftOutlined } from '@ant-design/icons';
import { AppContext } from '../../stores/AppStore';
import ComplexConditionExpressionListItem from '../entity_views/ComplexConditionExpressionListItem';
import EditorUtils from '../../utils/EditorUtils';
//import AppLogicController from '../../controllers/AppLogicController';
import AppDataFetchController from '../../controllers/AppDataFetchController';
import ConditionEditorUtils from '../../utils/ConditionEditorUtils';
import '../../styles/components/drawers/ConditionEditor.scss';


import ConditionEngine from '../../controllers/engines/ConditionEngine';

const { TabPane } = Tabs;
const { Text } = Typography;
const conditionCaret = <CaretLeftOutlined key='caret' style={{color: '#fa541c'}} />;
let engine;

const ConditionEditor = ({ isDrawerVisible, onDrawerClose }) => {
  const [state, dispatch] = useContext(AppContext);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [condition, setCondition] = useState(null);
  const [editorMode, setEditorMode] = useState(null);
  const [conditionType, setConditionType] = useState('1'); //1 => single, 2 => complex
  const [validCondition, setValidCondition] = useState(false);
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
      resetEditor();
      form.resetFields();
      setCondition(state.activeCondition);
      setEditorMode(state.conditionEditorMode);
      fillConditionValues();
      engine = new ConditionEngine();
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

  const resetEditor = () => {
    setSingleExpression(EditorUtils.getEmptyExpression());
    setComplexCondition([]);
    setComplexConditionExpressions([]);
    setValidCondition(false);
  };

  const fillConditionValues = () => {
    if (condition !== null) {
      if(condition.mode === 'simple') {
        setConditionType('1');
        fillSingleCondition();
      } else {
        setConditionType('2');
        fillComplexCondition();
      }
    } else {
      setConditionType('1');
    }
  };

  const fillSingleCondition = () => {
    const condExpression = condition.expressions[0];
    const exp = singleExpression;
    const gameStateProp = gameStates.find(gameState => gameState.id === condExpression.gsp_id);
    exp.gsProp = gameStateProp.name;
    exp.gsPropType = gameStateProp.type;
    exp.comp = null;
    exp.compId = condExpression.compId;
    exp.valueInputType = EditorUtils.getInputTypeForExpression(exp.gsPropType, exp.compId);
    exp.value = condExpression.value;
    exp.valueDisplay = condExpression.valueDisplay;
    setSingleExpression({ ...exp });
    setValidCondition(false);
  };

  const fillComplexCondition = () => {
    let gameStateProp;
    let exp;
    let newComplexConditionExpressions = [];

    if(editorMode === 'NAV_ACTION' && condition.logic_func.length === 1){
      setComplexCondition([...condition.logic_func, {type: 'logic', name: 'AND', displayName: 'AND'}]);
    } else {
      setComplexCondition(condition.logic_func);
    }

    condition.expressions.forEach(condExpression => {
      gameStateProp = gameStates.find(gameState => gameState.id === condExpression.gsp_id);
      exp = EditorUtils.getEmptyExpression(condExpression.name);
      exp.gsProp = gameStateProp.name;
      exp.gsPropType = gameStateProp.type;
      exp.comp = null;
      exp.compId = condExpression.compId;
      exp.valueInputType = EditorUtils.getInputTypeForExpression(exp.gsPropType, exp.compId);
      exp.value = condExpression.value;
      exp.valueDisplay = condExpression.valueDisplay;
      newComplexConditionExpressions.push(exp);
    });
    setComplexConditionExpressions(newComplexConditionExpressions);
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
    exp.valueDisplay = null;
    setSingleExpression({ ...exp });
    setValidCondition(false);
  };

  const handleSingleCondComparatorChange = (value) => {
    const exp = singleExpression;
    exp.compId = value;
    exp.valueInputType = EditorUtils.getInputTypeForExpression(exp.gsPropType, exp.compId);
    exp.value = null;
    exp.valueDisplay = null;
    setSingleExpression({ ...exp });
    setValidCondition(false);
  };

  const handleSingleCondValueChange = (value, valueDisplay) => {
    const exp = singleExpression;
    exp.value = value;
    exp.valueDisplay = valueDisplay;
    setSingleExpression({ ...exp });
    setValidCondition(false);
  };

  //complex condition expressions
  const handleComplexCondExpressionChange = (expression) => {
    const expressions = [...complexConditionExpressions];
    const index = expressions.findIndex(exp => exp.name === expression.name);
    expressions[index] = expression;
    setComplexConditionExpressions(expressions);
    setValidCondition(false);
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
        if(editorMode === 'NAV_ACTION' && newCondition.length === 2){
          return;
        }
        const removed = newCondition.pop();
        if(removed && removed.type === 'exp') {
          let newComplexConditionExpressions = [...complexConditionExpressions];
          newComplexConditionExpressions.pop();
          setComplexConditionExpressions(newComplexConditionExpressions);
        }
        break;
      case 'CLEAR':
        if(editorMode === 'NAV_ACTION'){
          newCondition = newCondition.slice(0, 2);
          let newComplexConditionExpressions = [...complexConditionExpressions];
          newComplexConditionExpressions = newComplexConditionExpressions.slice(0, 1);
          setComplexConditionExpressions(newComplexConditionExpressions);
        } else {
          newCondition = [];
          setComplexConditionExpressions([]);
        }
        break;
      default:
        break;
    }
    setComplexCondition(newCondition);
    setValidCondition(false);
  };

  const validateCurrentCondition = () => {
    if(conditionType === '1') { //validate single
      setValidCondition(validateExpression(singleExpression));
    } else { //validate complex
      //has expressions 
      const hasExpressions = complexConditionExpressions.length > 0;
      //all expressions are valid
      let validExpressions = 0;
      complexConditionExpressions.forEach(expression => {
        if(validateExpression(expression)) {
          validExpressions += 1;
        }
      });
      const allExpressionsValid = complexConditionExpressions.length === validExpressions;
      //condition is js valid
      const conditionValid = engine.validateComplexCondition(complexCondition, complexConditionExpressions);
      setValidCondition(hasExpressions && allExpressionsValid && conditionValid);
    }
  };

  const validateExpression = (expression) => {
    //prop
    if(expression.gsProp === null) {
      return false;
    }
    //comparator
    if(expression.compId === null) {
      return false;
    }
    //value
    if(expression.valueInputType === null) {
      return false;
    }
    switch(expression.valueInputType) {
      case 'SELECTOR':
        if(expression.value === null) {
          return false;
        }
        break;
      case 'TEXT_INT':
        if(expression.value === null || isNaN(expression.value)) {
          return false;
        }
        break;
      case 'TEXT_STRING': 
        if(expression.value === null || expression.value.trim().length === 0) {
          return false;
        }
        break;
      case 'BOOLEAN':
      case 'NONE':
      default:
        //no validation required for value
        break;
    }
    return true;
  };

  const buildExpressions = () => {
    let gameStateProp;
    if (conditionType === '1') {
      gameStateProp = gameStates.find(gameState => gameState.name === singleExpression.gsProp);
      return [{gsp_id: gameStateProp.id, compId: singleExpression.compId, value: singleExpression.value, valueDisplay: singleExpression.valueDisplay}];
    } else {
      let expressions = [];
      complexConditionExpressions.forEach(expression => {
        gameStateProp = gameStates.find(gameState => gameState.name === expression.gsProp);
        expressions.push({gsp_id: gameStateProp.id, compId: expression.compId, value: expression.value, valueDisplay: expression.valueDisplay, name: expression.name});
      });
      return expressions;
    }
  };

  const buildDisplayCondition = () => {
    let comparator;
    let valueDisplay;
    if (conditionType === '1') {
      comparator = EditorUtils.getComparatorName(singleExpression.compId);
      valueDisplay = singleExpression.valueDisplay !== null ? singleExpression.valueDisplay : singleExpression.value;
      return [{type: 'exp', propName: singleExpression.gsProp, comp: comparator, value: valueDisplay}]
    } else {
      let exp;
      let displayExp;
      let expressions = [];
      complexCondition.forEach(condition => {
        if(condition.type === 'exp') {
          exp = complexConditionExpressions.find(condExp => condExp.name === condition.name);
          comparator = EditorUtils.getComparatorName(exp.compId);
          valueDisplay = exp.valueDisplay !== null ? exp.valueDisplay : exp.value;
          displayExp = {type: 'exp', propName: exp.gsProp, comp: comparator, value: valueDisplay};
        } else if (condition.type === 'logic') {
          displayExp = {type: 'logic', name: condition.displayName};
        } else { // type === 'grouping'
          displayExp = {type: 'grouping', name: condition.displayName};
        }
        expressions.push(displayExp);
      });
      return expressions;
    }
  };

  const onFinish = (values) => {
    let result = {
      mode: (conditionType === '1') ? 'simple' : 'complex',
      expressions: buildExpressions(),
      display: buildDisplayCondition(),
    };
    if (conditionType === '2') {
      result.logic_func = complexCondition;
    }
    dispatch({type: 'SET_ACTIVE_CONDITION_COMPLETED', payload: result});
    closeDrawer();
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
      zIndex={1010}
      footer={
        <div style={{textAlign: 'right'}} >
          <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" style={{ marginRight: 8 }} onClick={validateCurrentCondition}>
            Validate
          </Button>
          <Button type="primary" htmlType="submit" form='add-edit-condition-id' disabled={!validCondition}>
            {(condition === null) ? 'Set' : 'Update'}
          </Button>
        </div>
      }
    >
      <Form layout='vertical' name='add-edit-condition' id='add-edit-condition-id' form={form} onFinish={onFinish} requiredMark={false}>
        <Tabs tabPosition='left' activeKey={conditionType} onChange={(activeKey) => { setConditionType(activeKey); setValidCondition(false); }}>
          <TabPane tab="Single" key="1" disabled={editorMode === 'NAV_ACTION'}>
            <Row gutter={[24, 16]}>
              <Col span={8}>
                <Form.Item
                  label="Game State Prop"
                >
                  {ConditionEditorUtils.renderGameStatePropsSelector(singleExpression.gsProp, handleSingleCondGSPropChange, gameStates)}
                </Form.Item>
              </Col>
              <Col span={8} style={{display: (singleExpression.gsProp !== null ? 'block' : 'none')}}>
                <Form.Item
                  label="Comparator"
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
                    renderItem={(item, index) => (
                      <ComplexConditionExpressionListItem
                        expression={item}
                        gameStates={gameStates}
                        onChange={handleComplexCondExpressionChange}
                        disabled={editorMode === 'NAV_ACTION' && index === 0}
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
