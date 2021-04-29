
class AppLogicUtils {
  static getNewStoryDefaultGameStateProps() {
    return [
      {name: 'currentChapter', type: 'integer', default: 0},
      {name: 'currentArea', type: 'area', default: 'Area1'},
    ];
  }

}

export default AppLogicUtils;