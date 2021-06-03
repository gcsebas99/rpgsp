import db from '../db/AppDatabase';

class AppValidationsController {
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