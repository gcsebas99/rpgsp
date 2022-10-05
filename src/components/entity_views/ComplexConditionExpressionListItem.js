import { List, Row, Col } from 'antd';
import ConditionEditorUtils from '../../utils/ConditionEditorUtils';
import EditorUtils from '../../utils/EditorUtils';

const ComplexConditionExpressionListItem = ({
  expression,
  gameStates,
  onChange,
  disabled = false,
}) => {

  const handleExpressionGSPropChange = (value) => {
    const exp = expression;
    const prop = gameStates[value];
    exp.gsProp = prop.name;
    exp.gsPropType = prop.type;
    exp.comp = null;
    exp.compId = null;
    exp.valueInputType = null;
    exp.value = null;
    exp.valueDisplay = null;
    onChange(exp);
  };

  const handleExpressionComparatorChange = (value) => {
    const exp = expression;
    exp.compId = value;
    exp.valueInputType = EditorUtils.getInputTypeForExpression(exp.gsPropType, exp.compId);
    exp.value = null;
    exp.valueDisplay = null;
    onChange(exp);
  };

  const handleExpressionValueChange = (value, valueDisplay) => {
    const exp = expression;
    exp.value = value;
    exp.valueDisplay = valueDisplay;
    onChange(exp);
  };


  return (
    <List.Item className='complex-condition-expression-list-item'>
      <Row gutter={[24, 8]} style={{width: '100%'}}>
        <Col span={4}>{expression.name}</Col>
        <Col span={7}>
          {ConditionEditorUtils.renderGameStatePropsSelector(expression.gsProp, handleExpressionGSPropChange, gameStates, disabled)}
        </Col>
        <Col span={6} style={{display: (expression.gsProp !== null ? 'block' : 'none')}}>
          {ConditionEditorUtils.renderComparatorSelector(expression.gsPropType, expression.compId, handleExpressionComparatorChange, disabled)}
        </Col>
        <Col span={7} style={{display: (expression.compId !== null && expression.compId !== 'IS_EMPTY' ? 'block' : 'none')}}>
          {ConditionEditorUtils.renderValueSelector(expression.gsPropType, expression.valueInputType, expression.value, handleExpressionValueChange, disabled)}
        </Col>
      </Row>
    </List.Item>
  );
};

export default ComplexConditionExpressionListItem;
