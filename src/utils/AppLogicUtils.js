
class AppLogicUtils {
  static getNewStoryDefaultGameStateProps() {
    return [
      {name: 'currentChapter', type: 'int', default: 1, default_table: null, default_tids: null, edit_mode: 'none', removable: false},
      {name: 'currentAct', type: 'int', default: 1, default_table: null, default_tids: null, edit_mode: 'none', removable: false},
      {name: 'currentActSequence', type: 'int', default: 0, default_table: null, default_tids: null, edit_mode: 'none', removable: false},
      {name: 'currentLocation', type: 'location', default: null, default_table: 'locations', default_tids: null, edit_mode: 'default', removable: false},
      {name: 'currentArea', type: 'area', default: null, default_table: 'areas', default_tids: null, edit_mode: 'default', removable: false},
    ];
  }

  static getNewStoryDefaultCharacters() {
    return [
      {name: '[Playable character]', description: '[Add description]', is_pc: true, color: '#0000ff'},
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

  static rebuildConversationCharacterIds(dialogs) {
    let characters = {};
    dialogs.forEach(dialog => {
      characters[dialog.character_id] = true;
    });
    if (Object.keys(characters).length > 0) {
      return ',' + Object.keys(characters).join(',') + ',';
    } else {
      return '';
    }
  }

  static getPropRelatedColor(name, type, defaultColors, customEntColors) {
    if (['currentChapter', 'currentAct', 'currentActSequence'].includes(name)) {
      return '#00b6ff';
    }
    switch(type) {
      case 'int':
      case 'intarr':
      case 'boolean':
      case 'booleanarr':
      case 'string':
      case 'stringarr':
        return '#fa541c';
      case 'location':
      case 'locationarr':
        return defaultColors.find(def_color => def_color.name === 'locations').color;
      case 'area':
      case 'areaarr':
        return defaultColors.find(def_color => def_color.name === 'areas').color;
      case 'character':
      case 'characterarr':
        return defaultColors.find(def_color => def_color.name === 'characters').color;
      default: //custom entity or entity arr
        let singular;
        if(type.endsWith('arr')) {
          singular = type.slice(0,-3);
        }else{
          singular = type;
        }
        return customEntColors.find(custom_def => custom_def.singular_name === singular).color;
    }
  }

  static getStoryVerifications() {
    return {
      oneLocationOneArea: false,
      oneCharacter: false,
    };
  }

}

export default AppLogicUtils;