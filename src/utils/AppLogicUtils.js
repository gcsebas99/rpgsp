
class AppLogicUtils {
  static getNewStoryDefaultGameStateProps() {
    return [
      {name: 'currentChapter', type: 'integer', default: 0, edit_mode: 'none', removable: false},
      {name: 'currentAct', type: 'integer', default: 0, edit_mode: 'none', removable: false},
      {name: 'currentActSequence', type: 'integer', default: 0, edit_mode: 'none', removable: false},
      {name: 'currentLocation', type: 'location', default: null, edit_mode: 'default', removable: false},
      {name: 'currentArea', type: 'area', default: null, edit_mode: 'default', removable: false},
    ];
  }

  static getNewStoryDefaultCharacters() {
    return [
      {name: '[Playable character]', description: '[Add description]'},
    ];
  }

  static getNewStoryDefaultEntityColors() {
    return [
      {name: 'locations', color: AppLogicUtils.getEntitiesDefaultColors('locations')},
      {name: 'areas', color: AppLogicUtils.getEntitiesDefaultColors('areas')},
      {name: 'characters', color: AppLogicUtils.getEntitiesDefaultColors('characters')},
    ];
  }

  static getEntitiesDefaultColors(name = 'locations') {
    switch(name) {
      case 'characters':
        return '#1890ff';
      case 'areas':
        return '#a0d911';
      case 'locations':
      default:
        return '#3f6600';
    }
  }

  static getCustomEntityRandomColor() {
    const defaultColorList = ['#ffa940', '#73d13d', '#10239e', '#36cfc9', '#9e1068', '#9254de', '#85a5ff', '#fadb14', '#ffa940', '#391085'];
    return defaultColorList[Math.floor(Math.random() * 10)];
  }

}

export default AppLogicUtils;