import { Select, Switch, Input, InputNumber, Tag } from 'antd';
import EditorUtils from './EditorUtils';
import EntitySelectorView from '../components/entity_views/EntitySelectorView';
import BooleanListInput from '../components/ui/forms/BooleanListInput';
const { Option } = Select;

class EffectsEditorUtils {
  static renderGameStatePropsSelector(selectValue, onChangeCallback, gameStates, disabled = false) {
    return (
      <Select value={selectValue} onChange={(value) => { onChangeCallback(value) }} style={{width: '100%'}} disabled={disabled}>
        { gameStates !== undefined && gameStates.map((gameState, index) => {
            return (<Option key={index} value={index}>{gameState.name} ({gameState.type})</Option>);
          })
        }
      </Select>
    );
  }

  static renderMutatorSelector(propType, selectValue, onChangeCallback, disabled = false) {
    return (
      <Select value={selectValue} onChange={(value) => { onChangeCallback(value) }} style={{width: '100%'}} disabled={disabled}>
        { propType && EditorUtils.getMutatorsForPropType(propType).map(mutator => {
            return (<Option key={mutator.id} value={mutator.id}>{mutator.name}</Option>);
          })
        }
      </Select>
    );
  }

  static renderValueSelector(propType, valueInputType, fieldValue, onChangeCallback, disabled = false) {
    let entityType;
    switch(valueInputType) {
      case 'TEXT_INT':
        return (
          <InputNumber value={fieldValue} onChange={(e) => { onChangeCallback(e, null) }} style={{width: '100%'}} disabled={disabled} />
        );
      case 'BOOLEAN':
        return (
          <Switch checkedChildren="true" unCheckedChildren="false" checked={fieldValue} onChange={(e) => { onChangeCallback(e, null) }} disabled={disabled} />
        );
      case 'TEXT_STRING':
        return (
          <Input value={fieldValue} onChange={(e) => { onChangeCallback(e.target.value, null) }} disabled={disabled} />
        );
      case 'SELECTOR_ENTITY':
        entityType = propType.endsWith('arr') ? propType.substring(0, propType.length-3) : propType;
        return (
          <EntitySelectorView entityType={entityType} value={fieldValue} onChangeCallback={onChangeCallback} disabled={disabled}/>
        );
      case 'SELECTOR_TAG_INT':
        return (
          <Select mode="tags" style={{ width: '100%' }} value={fieldValue} placeholder="Only integer values" onChange={(value) => { onChangeCallback(value, null) }} disabled={disabled}></Select>
        );
      case 'PICKER_BOOLEAN':
        return (
          <BooleanListInput value={fieldValue} onChange={onChangeCallback} disabled={disabled} />
        );
      case 'SELECTOR_TAG_STRING':
        return (
          <Select mode="tags" style={{ width: '100%' }} value={fieldValue} placeholder="Only string values" onChange={(value) => { onChangeCallback(value, null) }} disabled={disabled}></Select>
        );
      case 'SELECTOR_MULTI_ENTITY':
        entityType = propType.endsWith('arr') ? propType.substring(0, propType.length-3) : propType;
        return (
          <EntitySelectorView entityType={entityType} multiple value={fieldValue} onChangeCallback={onChangeCallback} disabled={disabled}/>
        );
      case 'REPLACE_INT':
      case 'REPLACE_BOOLEAN':
      case 'REPLACE_STRING':
      case 'REPLACE_ENTITY':
      case 'NONE':
      default:
        return null;
    }
  }

  static renderEffectsDisplay(effects) {
    const displayEffectValue = value => {
      if(typeof value === 'boolean'){
        return value ? 'TRUE' : 'FALSE';
      } else {
        if(Array.isArray(value)) {
          return '[' + value.join(', ') +']';
        } else {
          return value;
        }
      }
    };

    if (effects !== null && effects.display) {
      let color;
      let display;
      let renderEffects = [];
      effects.display.forEach((effect, index) => {
        color = effect.type === 'conv' ? '#52c41a' : '#1890ff';
        if(effect.type === 'conv') {
          display = 'CONV: ' + effect.name;
        } else {
          let mtr = (<strong style={{color: '#333333'}}>{effect.mutator}</strong>);
          display = (<>{effect.propName} {mtr} {displayEffectValue(effect.value)}</>);
        }
        renderEffects.push(<Tag key={index} color={color} style={{whiteSpace: 'normal'}}>{display}</Tag>);
      });
      return renderEffects;
    }
    return null;
  };

}

export default EffectsEditorUtils;
