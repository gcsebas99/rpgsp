import { Select, Switch, Input, InputNumber, Tag } from 'antd';
import EditorUtils from './EditorUtils';
import EntitySelectorView from '../components/entity_views/EntitySelectorView';
const { Option } = Select;

class ConditionEditorUtils {
  static renderGameStatePropsSelector(selectValue, onChangeCallback, gameStates, disabled = false) {
    return (
      <Select value={selectValue} onChange={(value) => { onChangeCallback(value) }} style={{width: '100%'}} disabled={disabled}>
        { gameStates !== undefined && gameStates.map((gameState, index) => {
            return (<Option key={index} value={index}>{gameState.name}</Option>);
          })
        }
      </Select>
    );
  }

  static renderComparatorSelector(propType, selectValue, onChangeCallback, disabled = false) {
    return (
      <Select value={selectValue} onChange={(value) => { onChangeCallback(value) }} style={{width: '100%'}} disabled={disabled}>
        { propType && EditorUtils.getComparatorsForPropType(propType).map(comparator => {
            return (<Option key={comparator.id} value={comparator.id}>{comparator.name}</Option>);
          })
        }
      </Select>
    );
  }

  static renderValueSelector(propType, valueInputType, fieldValue, onChangeCallback, disabled = false) {
    switch(valueInputType) {
      case 'BOOLEAN':
        return (
          <Switch checkedChildren="true" unCheckedChildren="false" checked={fieldValue} onChange={(e) => { onChangeCallback(e, null) }}  disabled={disabled} />
        );
      case 'TEXT_STRING':
        return (
          <Input value={fieldValue} onChange={(e) => { onChangeCallback(e.target.value, null) }}  disabled={disabled} />
        );
      case 'TEXT_INT':
        return (
          <InputNumber value={fieldValue} onChange={(e) => { onChangeCallback(e, null) }} style={{width: '100%'}} disabled={disabled} />
        );
      case 'SELECTOR':
        const entityType = propType.endsWith('arr') ? propType.substring(0, propType.length-3) : propType;
        return (
          <EntitySelectorView entityType={entityType} value={fieldValue} onChangeCallback={onChangeCallback} disabled={disabled} />
        );
      case 'NONE':
      default:
        return null;
    }
  }

  static renderConditionDisplay(condition) {
    const displayExpressionValue = value => {
      if(typeof value === 'boolean'){
        return value ? 'TRUE' : 'FALSE';
      } else {
        return value;
      }
    };

    if (condition !== null && condition.display) {
      let color;
      let display;
      let expressions = [];
      condition.display.forEach((expression, index) => {
        color = expression.type === 'logic' ? '#52c41a' : (expression.type === 'grouping' ? '#eb2f96' : '#1890ff');
        if(expression.type === 'logic' || expression.type === 'grouping') {
          display = expression.name;
        } else {
          let cmp = (<strong style={{color: '#333333'}}>{expression.comp}</strong>);
          display = (<>{expression.propName} {cmp} {displayExpressionValue(expression.value)}</>);
        }
        expressions.push(<Tag key={index} color={color}>{display}</Tag>);
      });
      return expressions;
    }
    return null;
  };

  static createOppositeCondition(condition) {
    let opposite = {
      mode: 'complex',
      expressions: [],
      logic_func: [],
      display: [],
    }; 
    opposite.logic_func.push({type: 'logic', name: 'NEG', displayName: 'NEG'});
    opposite.logic_func.push({type: 'grouping', name: 'OPEN', displayName: '('});
    opposite.display.push({type: 'logic', name: 'NEG'});
    opposite.display.push({type: 'grouping', name: '('});
    if(condition.mode === 'simple') {
      let exp = condition.expressions[0];
      exp.name = 'EXP1';
      opposite.logic_func.push({type: 'exp', name: 'EXP1', displayName: 'EXP1'});
      opposite.expressions.push(exp);
      opposite.display.push(condition.display[0]);
    } else {
      opposite.logic_func.push(...condition.logic_func);
      opposite.expressions.push(...condition.expressions);
      opposite.display.push(...condition.display);
    }
    opposite.logic_func.push({type: 'grouping', name: 'CLOSE', displayName: ')'});
    opposite.display.push({type: 'grouping', name: ')'});
    return opposite;
  };

  static createNavigationBaseCondition(areaId, areaName) {
    return {
      mode: 'complex',
      expressions: [{gsp_id: 5, compId: 'EQUALS', value: areaId, valueDisplay: areaName, name: 'EXP1'}],
      display: [{type: 'exp', propName: 'currentArea', comp: 'Equals', value: areaName}],
      logic_func: [{type: 'exp', name: 'EXP1', displayName: 'EXP1'}],
    };
  };

  static createNavigationEffect(areaId, areaName) {
    return {
      effects: [{gsp_id: 5, mutatorId: 'SET', value: areaId, valueDisplay: areaName, order: 0, type: 'prop'}],
      conversation: null,
      display: [{type: 'prop', propName: 'currentArea', mutator: 'Set value', value: areaName}],
    };
  };

}

export default ConditionEditorUtils;