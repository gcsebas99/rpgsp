import db from '../db/AppDatabase';

//Controls data operations in play mode
class PlayInteractionsController {

  static async updateGameStateProperty(dispatch, data) {
    return db.transaction('rw', db.play_game_state_props, async () => {
      const property = await db.play_game_state_props.where('game_state_prop_id').anyOf(data.game_state_prop_id).first();
      console.log('||--property', property);
      let updateValues = {'prev_value': property.value, 'value': data.newValue};
      if(property.tids) { //it needs update table ids too
        updateValues.prev_tids = property.tids;
        updateValues.tids = data.newTids;
      }
      await db.play_game_state_props.update(property.game_state_prop_id, updateValues);

    }).then(result => {
      
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static async simulateNextAct(dispatch) {
    return db.transaction('rw', db.play_game_state_props, db.chapters, db.acts, async () => {
      const currentChapter = await db.play_game_state_props.where('name').anyOf('currentChapter').first();
      const currentAct = await db.play_game_state_props.where('name').anyOf('currentAct').first();
      const chapter = await db.chapters.where('order').equals(currentChapter.value).first();
      const actsCount = await db.acts.where('chapter_id').equals(chapter.id).count();

      //console.log('||--simulateNextAct', currentChapter, currentAct, chapter, actsCount);

      if((currentAct.value + 1) > actsCount) { //next chapter
        await db.play_game_state_props.update(currentChapter.game_state_prop_id, {'value': currentChapter.value + 1});
        await db.play_game_state_props.update(currentAct.game_state_prop_id, {'value': 1});
      } else { //increment act
        await db.play_game_state_props.update(currentAct.game_state_prop_id, {'value': currentAct.value + 1});
      }


    }).then(result => {
      
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

}

export default PlayInteractionsController;