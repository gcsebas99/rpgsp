
class ConditionEngine {
  // constructor() {
  //   //console.log('||--A ConditionEngine is created, load stuff, etc');
  //   //this.gsProps = [];
  // }

  validateComplexCondition(conditionParts, expressions) {
    const testingCondition = this.buildExpressionFromParts(conditionParts, true);
    try {
      eval(testingCondition); // eslint-disable-line
      return true;
    } catch(error){
      return false;
    }
  }

  buildExpressionFromParts(parts, forTesting = false) {
    let expression = [];
    parts.forEach(part => {
      switch(part.type){
        case 'exp':
          if(forTesting) {
            expression.push("true");
          } else {
            expression.push(part.name);
          }
          break;
        case 'logic':
          if(part.name === 'AND') {
            expression.push('&&');
          } else if(part.name === 'OR') {
            expression.push('||');
          } else {
            expression.push('!');
          }
          break;
        case 'grouping':
          if(part.name === 'OPEN') {
            expression.push('(');
          } else {
            expression.push(')');
          }
          break;
        default:
          break;
      }
    });
    return expression.join(' ');
  }
}

export default ConditionEngine;