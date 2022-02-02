
class ConversionUtils {
  static arrayToObject(arrayValue, keyName) {
    return arrayValue && arrayValue.reduce((acc, cur, i) => { acc[cur[keyName]] = cur; return acc; }, {});
  }

}

export default ConversionUtils;