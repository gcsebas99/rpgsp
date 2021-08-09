import { Select, Switch, Input, InputNumber } from 'antd';
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
          <Switch checkedChildren="true" unCheckedChildren="false" checked={fieldValue} onChange={(e) => { onChangeCallback(e) }} />
        );
      case 'TEXT_STRING':
        return (
          <Input value={fieldValue} onChange={(e) => { onChangeCallback(e.target.value) }} />
        );
      case 'TEXT_INT':
        return (
          <InputNumber value={fieldValue} onChange={(e) => { onChangeCallback(e) }} style={{width: '100%'}} />
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

}

export default ConditionEditorUtils;