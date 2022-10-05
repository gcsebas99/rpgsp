
class ConversionUtils {
  static arrayToObject(arrayValue, keyName) {
    return arrayValue && arrayValue.reduce((acc, cur, i) => { acc[cur[keyName]] = cur; return acc; }, {});
  }

  static hex2rgba(hex, alpha = 1) {
    const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
    return `rgba(${r},${g},${b},${alpha})`;
  }

}

export default ConversionUtils;