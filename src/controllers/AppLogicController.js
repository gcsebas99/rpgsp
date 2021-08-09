import db, { testDatabase } from '../db/AppDatabase';
import AppLogicUtils from '../utils/AppLogicUtils';

//Controls modifications in app state and database
class AppLogicController {

  static checkDatabaseOk(dispatch) {
    testDatabase().catch((err) => {
      console.error('Failed to open db: ' + (err.stack || err));
      dispatch({type: 'SET_APP_DATABASE_LOAD_ERROR'});
    });
  }

  static async checkStoryLoaded(dispatch) {
    const story = await db.stories.where('id').equals(1).first();
    if (story !== undefined) {
      dispatch({type: 'SET_STORY_LOADED', payload: true});
    }
    dispatch({type: 'SET_APP_INITIAL_CHECK_DONE'});
  }

  //-- Story --//
  static createNewStory(dispatch, data) {
    return db.transaction('rw', db.stories, db.game_state_props, db.characters, db.default_entity_colors, async () => {
      await db.stories.add({'title': data.title, 'version': data.version});
      await db.game_state_props.bulkAdd( AppLogicUtils.getNewStoryDefaultGameStateProps() );
      await db.characters.bulkAdd( AppLogicUtils.getNewStoryDefaultCharacters() );
      await db.default_entity_colors.bulkAdd( AppLogicUtils.getNewStoryDefaultEntityColors() );
    }).then(result => {
      dispatch({type: 'SET_STORY_LOADED', payload: true});
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
    // db.stories.add({'title': data.title, 'version': data.version}).then(() => {
    //   dispatch({type: 'SET_STORY_LOADED', payload: true});
    // });
  }

  //-- GameStateProps --//
  static createNewGameStateProp(dispatch, data) {
    return db.game_state_props.add({'name': data.name, 'type': data.type, 'default': data.defaultValue, 'edit_mode': data.editMode, 'removable': data.removable}).then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static updateGameStateProp(dispatch, key, data) {
    return db.game_state_props.update(key, {'name': data.name, 'type': data.type, 'default': data.defaultValue, 'edit_mode': data.editMode, 'removable': data.removable}).then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static deleteGameStateProp(dispatch, id) {
    return db.game_state_props.delete(id).then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  //-- Location & Areas --//
  static createNewLocation(dispatch, data) {
    return db.locations.add({'name': data.name, 'description': data.description}).then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static updateLocation(dispatch, key, data) {
    return db.locations.update(key, {'name': data.name, 'description': data.description}).then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static deleteLocation(dispatch, id) {
    return db.transaction('rw', db.locations, db.areas, async () => {
      await db.areas.where('location_id').equals(id).delete();
      await db.locations.delete(id);
    }).then(result => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static createNewArea(dispatch, data) {
    return db.areas.add({'location_id': data.location_id, 'name': data.name, 'description': data.description}).then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static updateArea(dispatch, key, data) {
    return db.areas.update(key, {'name': data.name, 'description': data.description}).then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static deleteArea(dispatch, id) {
    return db.areas.delete(id).then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  //-- Character --//
  static createNewCharacter(dispatch, data) {
    return db.characters.add({'name': data.name, 'description': data.description}).then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static updateCharacter(dispatch, key, data) {
    return db.characters.update(key, {'name': data.name, 'description': data.description}).then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static deleteCharacter(dispatch, id) {
    return db.characters.delete(id).then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  //-- Custom Entities --//
  static createNewCustomEntityDef(dispatch, data) {
    return db.custom_entity_defs.add({'name': data.name, 'key': data.key, 'singular_name': data.singular, 'color': AppLogicUtils.getCustomEntityRandomColor()}).then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static deleteCustomEntityDef(dispatch, id) {
    return db.transaction('rw', db.custom_entity_defs, db.custom_entities, async () => {
      await db.custom_entities.where('custom_entity_def_id').equals(id).delete();
      await db.custom_entity_defs.delete(id);
    }).then(result => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static createNewCustomEntity(dispatch, data) {
    return db.custom_entities.add({'custom_entity_def_id': data.custom_entity_def_id, 'name': data.name, 'description': data.description}).then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static updateCustomEntity(dispatch, key, data) {
    return db.custom_entities.update(key, {'name': data.name, 'description': data.description}).then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static deleteCustomEntity(dispatch, id) {
    return db.custom_entities.delete(id).then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  //-- Colors --//
  static updateDefaultEntityColor(dispatch, key, data) {
    return db.default_entity_colors.update(key, {'color': data.color}).then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static updateCustomEntityDefColor(dispatch, key, data) {
    return db.custom_entity_defs.update(key, {'color': data.color}).then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  //-- Chapters --//
  static createNewChapter(dispatch, data) {
    return db.chapters.add({'name': data.name, 'description': data.description, 'order': data.order}).then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static updateChapter(dispatch, key, data) {
    //do not accept order update
    return db.chapters.update(key, {'name': data.name, 'description': data.description}).then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static updateChapterOrder(dispatch, key, data) {
    return db.transaction('rw', db.chapters, async () => {
      const affectedChapter = await db.chapters.where('order').equals(data.order).first();
      await db.chapters.update(key, {'order': data.order});
      await db.chapters.update(affectedChapter.id, {'order': data.oldOrder});
    }).then(result => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static deleteChapter(dispatch, id) {
    return db.transaction('rw', db.chapters, async () => {
      let newBaseOrder = null;
      let affectedChapters = [];
      const chapters = db.chapters.orderBy('order');
      await chapters.each(chapter => {
        if(newBaseOrder !== null){
          affectedChapters.push({key: chapter.id, order: newBaseOrder + affectedChapters.length});
        }
        if(chapter.id === id){
          newBaseOrder = chapter.order;
        }
      });
      await db.chapters.delete(id);
      affectedChapters.forEach(async (affected) => {
        await db.chapters.update(affected.key, {'order': affected.order});
      });

      //TODO remove acts, remove sequenced actions associated to acts, remove end conditions associated to acts



    }).then(result => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  //-- Acts --//
  static createNewAct(dispatch, data) {
    return db.acts.add({'chapter_id': data.chapter_id, 'name': data.name, 'description': data.description, 'order': data.order, 'type': data.type}).then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static updateAct(dispatch, key, data) {
    //do not accept order update
    return db.acts.update(key, {'name': data.name, 'description': data.description}).then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static updateActOrder(dispatch, key, data) {
    return db.transaction('rw', db.acts, async () => {
      const affectedAct = await db.acts.where({chapter_id: data.chapter_id, order: data.order}).first();
      await db.acts.update(key, {'order': data.order});
      await db.acts.update(affectedAct.id, {'order': data.oldOrder});
    }).then(result => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static deleteAct(dispatch, id, chapter_id) {
    return db.transaction('rw', db.acts, async () => {
      let newBaseOrder = null;
      let affectedActs = [];
      const acts = await db.acts.where('chapter_id').equals(chapter_id).toArray();
      const orderedActs = acts.sort((a, b) => { return a.order - b.order; });
      await orderedActs.forEach(act => {
        if(newBaseOrder !== null){
          affectedActs.push({key: act.id, order: newBaseOrder + affectedActs.length});
        }
        if(act.id === id){
          newBaseOrder = act.order;
        }
      });
      await db.acts.delete(id);
      affectedActs.forEach(async (affected) => {
        await db.acts.update(affected.key, {'order': affected.order});
      });

      //TODO remove sequenced actions associated to act, remove end conditions associated to act


    }).then(result => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  //-- Dev --//
  static devStartOver(dispatch) {
    return db.delete().then( () => window.location.reload() );
  }
}

export default AppLogicController;