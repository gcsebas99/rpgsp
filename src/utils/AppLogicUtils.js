
class AppLogicUtils {
  static getNewStoryDefaultGameStateProps() {
    return [
      {name: 'currentChapter', type: 'integer', default: 0, removable: false},
      {name: 'currentAct', type: 'integer', default: 0, removable: false},
      {name: 'currentActSequence', type: 'integer', default: 0, removable: false},
      {name: 'currentLocation', type: 'location', default: null, removable: false},
      {name: 'currentArea', type: 'area', default: null, removable: false},
    ];
  }

  static getNewStoryDefaultCharacters() {
    return [
      {name: '[Playable character]', description: '[Add description]'},
    ];
  }

}

export default AppLogicUtils;