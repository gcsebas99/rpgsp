import { List, Row, Col, Button } from 'antd';
import EffectsEditorUtils from '../../utils/EffectsEditorUtils';
// import EditorUtils from '../../utils/EditorUtils';

const EffectListItem = ({
  effect,
  gameStates,
  onRemove,
}) => {

  // const handleExpressionGSPropChange = (value) => {
  //   const exp = expression;
  //   const prop = gameStates[value];
  //   exp.gsProp = prop.name;
  //   exp.gsPropType = prop.type;
  //   exp.comp = null;
  //   exp.compId = null;
  //   exp.valueInputType = null;
  //   exp.value = null;
  //   exp.valueDisplay = null;
  //   onChange(exp);
  // };

  // const handleExpressionComparatorChange = (value) => {
  //   const exp = expression;
  //   exp.compId = value;
  //   exp.valueInputType = EditorUtils.getInputTypeForExpression(exp.gsPropType, exp.compId);
  //   exp.value = null;
  //   exp.valueDisplay = null;
  //   onChange(exp);
  // };

  // const handleExpressionValueChange = (value, valueDisplay) => {
  //   const exp = expression;
  //   exp.value = value;
  //   exp.valueDisplay = valueDisplay;
  //   onChange(exp);
  // };


  return (
    <List.Item className='effect-list-item'>
      <Row gutter={[24, 8]} style={{width: '100%'}}>
        <Col span={7}>
          {EffectsEditorUtils.renderGameStatePropsSelector(effect.gsProp, () => {}, gameStates, true)}
        </Col>
        <Col span={7}>
          {EffectsEditorUtils.renderMutatorSelector(effect.gsPropType, effect.mutatorId, () => {}, true)}
        </Col>
        <Col span={7}>
          {EffectsEditorUtils.renderValueSelector(effect.gsPropType, effect.valueInputType, effect.value, () => {}, true)}
        </Col>
        <Col span={3}>
          <Button type='default' size='small' onClick={onRemove}>Remove</Button>
        </Col>
      </Row>
    </List.Item>
  );
};


export default EffectListItem;
