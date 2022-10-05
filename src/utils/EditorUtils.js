
class EditorUtils {
  static getComparatorName(id) {
    switch(id) {
      case 'EQUALS': return 'Equals';
      case 'NOT_EQUALS': return 'Not equals';
      case 'LOWER': return 'Lower than';
      case 'GREATER': return 'Greater than';
      case 'IS_EMPTY': return 'Is empty';
      case 'CONTAINS': return 'Contains';
      case 'NOT_CONTAINS': return 'Not contains';
      case 'SIZE_EQUALS': return 'Size equals';
      case 'SIZE_LOWER': return 'Size lower than';
      case 'SIZE_GREATER': return 'Size greater than';
      default: return '';
    }
  }

  static getComparatorsForPropType(propType) {
    if(!propType.endsWith('arr')) { //not array
      switch(propType) {
        case 'int':
          return [
            {id: 'EQUALS', name: 'Equals'},
            {id: 'NOT_EQUALS', name: 'Not equals'},
            {id: 'LOWER', name: 'Lower than'},
            {id: 'GREATER', name: 'Greater than'}
          ];
        case 'boolean':
          return [
            {id: 'EQUALS', name: 'Equals'},
            {id: 'NOT_EQUALS', name: 'Not equals'}
          ];
        case 'string':
        case 'location':
        case 'area':
        case 'character':
        default: //custom entity
          return [
            {id: 'IS_EMPTY', name: 'Is empty'},
            {id: 'EQUALS', name: 'Equals'},
            {id: 'NOT_EQUALS', name: 'Not equals'}
          ];
      }
    } else { //array
      return [
        {id: 'IS_EMPTY', name: 'Is empty'},
        {id: 'CONTAINS', name: 'Contains'},
        {id: 'NOT_CONTAINS', name: 'Not contains'},
        {id: 'SIZE_EQUALS', name: 'Size equals'},
        {id: 'SIZE_LOWER', name: 'Size lower than'},
        {id: 'SIZE_GREATER', name: 'Size greater than'}
      ];
    }
  }

  static getMutatorName(id) {
    switch(id) {
      case 'INCREMENT': return 'Increment';
      case 'DECREASE': return 'Decrease';
      case 'SET': return 'Set value';
      case 'TOGGLE': return 'Toggle';
      case 'CLEAR': return 'Clear';
      case 'ADD': return 'Add one or many';
      case 'REMOVE': return 'Remove one or many';
      default: return '';
    }
  }

  static getMutatorsForPropType(propType) {
    if(!propType.endsWith('arr')) { //not array
      switch(propType) {
        case 'int':
          return [
            {id: 'INCREMENT', name: 'Increment'},
            {id: 'DECREASE', name: 'Decrease'},
            {id: 'SET', name: 'Set value'},
          ];
        case 'boolean':
          return [
            {id: 'TOGGLE', name: 'Toggle'},
            {id: 'SET', name: 'Set value'},
          ];
        case 'string':
        case 'location':
        case 'area':
        case 'character':
        default: //custom entity
          return [
            {id: 'SET', name: 'Set value'},
            {id: 'CLEAR', name: 'Clear'},
          ];
      }
    } else { //array
      return [
        {id: 'ADD', name: 'Add one or many'},
        {id: 'REMOVE', name: 'Remove one or many'},
        // {id: 'REPLACE', name: 'Replace one'},
        {id: 'CLEAR', name: 'Clear'},
      ];
    }
  }

  static getInputTypeForExpression(propType, comparatorId) {
    if(!propType.endsWith('arr')) { //not array
      switch(propType) {
        case 'int':
          return 'TEXT_INT';
        case 'boolean':
          return 'BOOLEAN';
        case 'string':
          if(comparatorId !== 'IS_EMPTY') {
            return 'TEXT_STRING';
          } else {
            return 'NONE';
          }
        case 'location':
        case 'area':
        case 'character':
        default: //custom entity
          if(comparatorId !== 'IS_EMPTY') {
            return 'SELECTOR';
          } else {
            return 'NONE';
          }
      }
    } else { //array
      switch(comparatorId) {
        case 'CONTAINS':
        case 'NOT_CONTAINS':
          switch(propType) {
            case 'intarr':
              return 'TEXT_INT';
            case 'booleanarr':
              return 'BOOLEAN';
            case 'stringarr':
              return 'TEXT_STRING';
            case 'locationarr':
            case 'areaarr':
            case 'characterarr':
            default: //custom entity array
              return 'SELECTOR';
          }
        case 'SIZE_EQUALS': 
        case 'SIZE_LOWER': 
        case 'SIZE_GREATER':
          return 'TEXT_INT';
        case 'IS_EMPTY':
        default:
          return 'NONE';
      }
    }
  }

  static getInputTypeForMutator(propType, mutatorId) {
    if(!propType.endsWith('arr')) { //not array
      switch(propType) {
        case 'int':
          return 'TEXT_INT';
        case 'boolean':
          switch(mutatorId) {
            case 'TOGGLE':
              return 'NONE';
            case 'SET':
            default:
              return 'BOOLEAN';
          }
        case 'string':
          switch(mutatorId) {
            case 'SET':
              return 'TEXT_STRING';
            case 'CLEAR':
            default:
              return 'NONE';
          }
        case 'location':
        case 'area':
        case 'character':
        default: //custom entity
          switch(mutatorId) {
            case 'SET':
              return 'SELECTOR_ENTITY';
            case 'CLEAR':
            default:
              return 'NONE';
          }
      }
    } else { //array
      switch(mutatorId) {
        case 'ADD':
        case 'REMOVE':
          switch(propType) {
            case 'intarr':
              return 'SELECTOR_TAG_INT';
            case 'booleanarr':
              return 'PICKER_BOOLEAN';
            case 'stringarr':
              return 'SELECTOR_TAG_STRING';
            case 'locationarr':
            case 'areaarr':
            case 'characterarr':
            default: //custom entity array
              return 'SELECTOR_MULTI_ENTITY';
          }
        // case 'REPLACE': 
        //   switch(propType) {
        //     case 'intarr':
        //       return 'REPLACE_INT';
        //     case 'booleanarr':
        //       return 'REPLACE_BOOLEAN';
        //     case 'stringarr':
        //       return 'REPLACE_STRING';
        //     case 'locationarr':
        //     case 'areaarr':
        //     case 'characterarr':
        //     default: //custom entity array
        //       return 'REPLACE_ENTITY';
        //   }
        case 'CLEAR':
        default:
          return 'NONE';
      }
    }
  }

  static getEmptyExpression(name = null) {
    let emptyExpression = {
      gsProp: null,
      gsPropType: null,
      comp: null,
      compId: null,
      valueInputType: null,
      value: null,
      valueDisplay: null,
    };
    if(name) {
      emptyExpression.name = name;
    }
    return emptyExpression;
  }

  static getEmptyEffect() {
    return {
      gsProp: null,
      gsPropType: null,
      mutatorId: null,
      valueInputType: null,
      value: null,
      valueDisplay: null,
    };
  }

}

export default EditorUtils;
