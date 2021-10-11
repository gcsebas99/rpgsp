
class LocationMapUtils {

  static getLocationMapDimension() {
    return {x: 20, y: 20};
  }

  static convertJsonMapToEditableObject(jsonMap) {
    if (typeof jsonMap === 'string') {
      let editableObject = {};
      let areaId;
      const mapObj = JSON.parse(jsonMap);
      Object.keys(mapObj).forEach(key => {
        areaId = parseInt(key);
        mapObj[key].forEach(xyPos => {
          editableObject[xyPos] = areaId;
        });
      });
      return editableObject;
    }
    return {};
  }

  static convertEditableObjectToJsonMap(objectMap) {
    if (Object.keys(objectMap).length > 0) {
      let jsonMap = {};
      let areaIdStr;
      Object.keys(objectMap).forEach(key => {
        areaIdStr = objectMap[key].toString();
        if (areaIdStr in jsonMap) {
          jsonMap[areaIdStr].push(key);
        } else {
          jsonMap[areaIdStr] = [key];
        }
      });
      return JSON.stringify(jsonMap);
    }
    return null;
  }

  static setMapTile(objectMap, position, newValue) {
    if (newValue === null) {
      delete objectMap[position];
    } else {
      objectMap[position] = newValue;
    }
    return objectMap;
  }

  static removeAreaFromMap(jsonMap, areaId) {
    if (typeof jsonMap === 'string') {
      const mapObj = JSON.parse(jsonMap);
      delete mapObj[areaId];
      return JSON.stringify(mapObj);
    }
    return null;
  }

}

export default LocationMapUtils;