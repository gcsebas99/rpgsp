
class EditorUtils {
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

  static getEmptyExpression(name = null) {
    let emptyExpression = {
      gsProp: null,
      gsPropType: null,
      comp: null,
      compId: null,
      valueInputType: null,
      value: null
    };
    if(name) {
      emptyExpression.name = name;
    }
    return emptyExpression;
  }

}

export default EditorUtils;
