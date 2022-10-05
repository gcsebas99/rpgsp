import db from '../db/AppDatabase';
import AppLogicUtils from '../utils/AppLogicUtils';

//Controls app-level verifications
class AppValidationsController {

  //-- verify story is runnable --//
  static async verifyStoryRunnable(dispatch) {
    dispatch({type: 'SET_STORY_VERIFYING_RUNNABLE'});
    let verifications = AppLogicUtils.getStoryVerifications();
    let runnable = true;

    //Verify all data in story is set properly to execute playtesting:

    //At least 1-Loc 1-Area
    let oneLocation = false;
    let oneArea = false;
    await db.locations.count(count => { 
      oneLocation = count > 0; 
      runnable = runnable && oneLocation;
    });
    await db.areas.count(count => { 
      oneArea = count > 0; 
      runnable = runnable && oneArea;
    });
    verifications.oneLocationOneArea = oneLocation && oneArea;



    

    //Prop curerntArea set (currentLocation auto)
    //All locs have map, all areas have cells in map
    //At least 1 character PC
    //At least 1 chapter with 1 act
    //All chapters has acts
    //All sequential acts have actions
    //All interactive acts have end conditions


    //story has at least 1 character
    await db.characters.count(count => { 
      verifications.oneCharacter = count > 0; 
      runnable = runnable && verifications.oneCharacter;
    });


    setTimeout(() => { dispatch({type: (runnable ? 'SET_STORY_RUNNABLE' : 'SET_STORY_NOT_RUNNABLE') , payload: verifications }); }, 1000);
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