import db from '../db/AppDatabase';
import AppLogicUtils from '../utils/AppLogicUtils';

class AppLogicController {
  static createNewStory(dispatch, data) {

    return db.transaction('rw', db.stories, db.game_state_props, async () => {

      await db.stories.add({'title': data.title, 'version': data.version});
      await db.game_state_props.bulkAdd( AppLogicUtils.getNewStoryDefaultGameStateProps() );

    }).then(result => {

      console.log('||--SUCCESS');
      dispatch({type: 'SET_STORY_LOADED', payload: true});

    }).catch(error => {

      //
      // Transaction Failed
      //
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      //return Promise.reject(error);

    });
    

    // db.stories.add({'title': data.title, 'version': data.version}).then(() => {
    //   dispatch({type: 'SET_STORY_LOADED', payload: true});
    // });

  }

}

export default AppLogicController;