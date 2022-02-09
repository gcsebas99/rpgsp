import { Select, Switch, Input, InputNumber, Tag } from 'antd';
import EditorUtils from './EditorUtils';
import EntitySelectorView from '../components/entity_views/EntitySelectorView';
const { Option } = Select;

class ConditionEditorUtils {
  static renderGameStatePropsSelector(selectValue, onChangeCallback, gameStates) {
    return (
      <Select value={selectValue} onChange={(value) => { onChangeCallback(value) }} style={{width: '100%'}}>
        { gameStates !== undefined && gameStates.map((gameState, index) => {
            return (<Option key={index} value={index}>{gameState.name}</Option>);
          })
        }
      </Select>
    );
  }

  static renderComparatorSelector(propType, selectValue, onChangeCallback) {
    return (
      <Select value={selectValue} onChange={(value) => { onChangeCallback(value) }} style={{width: '100%'}}>
        { propType && EditorUtils.getComparatorsForPropType(propType).map(comparator => {
            return (<Option key={comparator.id} value={comparator.id}>{comparator.name}</Option>);
          })
        }
      </Select>
    );
  }

  static renderValueSelector(propType, valueInputType, fieldValue, onChangeCallback) {
    switch(valueInputType) {
      case 'BOOLEAN':
        return (
          <Switch checkedChildren="true" unCheckedChildren="false" checked={fieldValue} onChange={(e) => { onChangeCallback(e, null) }} />
        );
      case 'TEXT_STRING':
        return (
          <Input value={fieldValue} onChange={(e) => { onChangeCallback(e.target.value, null) }} />
        );
      case 'TEXT_INT':
        return (
          <InputNumber value={fieldValue} onChange={(e) => { onChangeCallback(e, null) }} style={{width: '100%'}} />
        );
      case 'SELECTOR':
        const entityType = propType.endsWith('arr') ? propType.substring(0, propType.length-3) : propType;
        return (
          <EntitySelectorView entityType={entityType} value={fieldValue} onChangeCallback={onChangeCallback} />
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

}

export default ConditionEditorUtils;