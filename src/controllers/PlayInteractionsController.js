import db from '../db/AppDatabase';

//Controls data operations in play mode
class PlayInteractionsController {

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