import db from '../db/AppDatabase';

//Controls app-level verifications
class AppValidationsController {

  //-- verify story is runnable --//
  static async verifyStoryRunnable(dispatch) {
    dispatch({type: 'SET_STORY_VERIFYING_RUNNABLE'});

    //TODO: Verify all data in story is set properly to execute playtesting

    setTimeout(() => { dispatch({type: 'SET_STORY_RUNNABLE'}); }, 1000);

  }

  //-- validateEntityNames --//
  static async validateEntityNames(testNames, dbTable) {
    let invalidNames = [];
    return db.transaction('r', dbTable, async () => {
      for (const name of testNames) {
        const entity = await dbTable.where({name: name}).first();
        if(entity === undefined){
          invalidNames.push(name);
        }
      }
      if(invalidNames.length === 0) {
        return Promise.resolve();
      } else {
        return Promise.reject(invalidNames);
      }
    });
  }

  static async validateCustomEntityNames(testNames, entityDefId) {
    let invalidNames = [];
    return db.transaction('r', db.custom_entities, async () => {
      for (const name of testNames) {
        const entity = await db.custom_entities.where({name: name, custom_entity_def_id: entityDefId}).first();
        if(entity === undefined){
          invalidNames.push(name);
        }
      }
      if(invalidNames.length === 0) {
        return Promise.resolve();
      } else {
        return Promise.reject(invalidNames);
      }
    });
  }

}

export default AppValidationsController;