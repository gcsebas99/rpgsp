import db, { testDatabase } from '../db/AppDatabase';
import AppLogicUtils from '../utils/AppLogicUtils';
import LocationMapUtils from '../utils/LocationMapUtils';
import ConditionEditorUtils from '../utils/ConditionEditorUtils';

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
    return db.game_state_props.add({'name': data.name, 'type': data.type, 'default': data.defaultValue, 'default_table': data.defaultTable || null, 'default_tids': data.defaultTids || null, 'edit_mode': data.editMode, 'removable': data.removable}).then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static updateGameStateProp(dispatch, key, data) {
    return db.game_state_props.update(key, {'name': data.name, 'type': data.type, 'default': data.defaultValue, 'default_table': data.defaultTable || null, 'default_tids': data.defaultTids || null, 'edit_mode': data.editMode, 'removable': data.removable}).then(() => {
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

  static updateLocationMap(dispatch, key, data) {
    return db.locations.update(key, {'map': data.map}).then(() => {
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
    return db.areas.add({'location_id': data.location_id, 'name': data.name, 'description': data.description, 'color': data.color, 'sound': data.sound}).then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static updateArea(dispatch, key, data) {
    return db.areas.update(key, {'name': data.name, 'description': data.description, 'color': data.color, 'sound': data.sound}).then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static deleteArea(dispatch, id) {
    return db.transaction('rw', db.locations, db.areas, async () => {
      const area = await db.areas.where({id: id}).first();
      const location = await db.locations.where({id: area.location_id}).first();
      const newJsonMap = LocationMapUtils.removeAreaFromMap(location.map, id);
      const data = {map: newJsonMap};
      await AppLogicController.updateLocationMap(dispatch, location.id, data);
      await db.areas.delete(id);
    }).then(result => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });

    
    //change to transaction
      //get location
      //change location map
      //save location map
      //remove 



    // return db.areas.delete(id).then(() => {
    //   //
    // }).catch(error => {
    //   console.log('||--FAIL', error);
    //   //return reject to allow catch chain
    //   return Promise.reject(error);
    // });
  }

  //-- Character --//
  static createNewCharacter(dispatch, data) {
    return db.characters.add({'name': data.name, 'description': data.description, 'is_pc': data.isPC, 'color': data.color, 'image': data.image}).then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static updateCharacter(dispatch, key, data) {
    return db.characters.update(key, {'name': data.name, 'description': data.description, 'is_pc': data.isPC, 'color': data.color, 'image': data.image}).then(() => {
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

  static updateActEndCondition(dispatch, key, data) {
    console.log('||--updateActEndCondition', data);
    return db.acts.update(key, {'end_condition': data.endCondition}).then(() => {
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

  //---------------------------------------//
  //-------------- Actions ----------------//
  //---------------------------------------//

  //-- Sequenced Actions --//
  static createNewSequencedAction(dispatch, data) {
    return db.sequenced_actions.add({'act_id': data.actId, 'order': data.order, 'text_value': data.textValue, 'type': data.type, 'character_id': data.characterId}).then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static updateSequencedAction(dispatch, key, data) {
    //do not accept order update
    return db.sequenced_actions.update(key, {'text_value': data.textValue, 'type': data.type, 'character_id': data.characterId}).then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static updateSequencedActionOrder(dispatch, key, data) {
    return db.transaction('rw', db.sequenced_actions, async () => {
      const affectedSequencedAction = await db.sequenced_actions.where({act_id: data.actId, order: data.order}).first();
      await db.sequenced_actions.update(key, {'order': data.order});
      await db.sequenced_actions.update(affectedSequencedAction.id, {'order': data.oldOrder});
    }).then(result => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static deleteSequencedAction(dispatch, id, actId) {
    return db.transaction('rw', db.sequenced_actions, async () => {
      let newBaseOrder = null;
      let affectedSequencedActions = [];
      const sequencedActions = await db.sequenced_actions.where('act_id').equals(actId).toArray();
      const orderedSequencedActions = sequencedActions.sort((a, b) => { return a.order - b.order; });
      await orderedSequencedActions.forEach(action => {
        if(newBaseOrder !== null){
          affectedSequencedActions.push({key: action.id, order: newBaseOrder + affectedSequencedActions.length});
        }
        if(action.id === id){
          newBaseOrder = action.order;
        }
      });
      await db.sequenced_actions.delete(id);
      affectedSequencedActions.forEach(async (affected) => {
        await db.sequenced_actions.update(affected.key, {'order': affected.order});
      });
    }).then(result => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  //-- Navigation Actions --//
  static createNavigationActions(dispatch, data) {
    const twoActions = data.builderData.twoWay;
    let action1 = null;
    let action1Effects;
    let action2 = null;
    let action2Effects;

    return db.transaction('rw', db.game_actions, db.effects, db.nav_action_builders, async () => {
      //create action(s)
      action1 = await db.game_actions.add({'type': 'nav', 'description': data.actions[0].description, 'allow_repeat': data.actions[0].allowRepeat, 'required_condition': data.actions[0].requiredCondition, 'effects_display': data.actions[0].effectsDisplay});
      if(twoActions) {
        action2 = await db.game_actions.add({'type': 'nav', 'description': data.actions[1].description, 'allow_repeat': data.actions[1].allowRepeat, 'required_condition': data.actions[1].requiredCondition, 'effects_display': data.actions[1].effectsDisplay});
      }
      //create effects for each action
      action1Effects = data.actions[0].effects.map((effect) => { effect.actionId = action1; return effect; });
      await AppLogicController.createNewEffectsList(dispatch, action1Effects);
      if(twoActions) {
        action2Effects = data.actions[1].effects.map((effect) => { effect.actionId = action2; return effect; });
        await AppLogicController.createNewEffectsList(dispatch, action2Effects);
      }
      //create builder
      await db.nav_action_builders.add({'nav1_id': action1, 'nav2_id': action2, 'area1': data.builderData.area1, 'area2': data.builderData.area2, 'two_way': data.builderData.twoWay});
    }).then(result => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static deleteNavigationActions(dispatch, id) {
    return db.transaction('rw', db.game_actions, db.effects, db.nav_action_builders, async () => {
      let ids = [];
      const nav_action_builder = await db.nav_action_builders.where({id: id}).first();
      ids.push(nav_action_builder.nav1_id);
      if(nav_action_builder.two_way) { ids.push(nav_action_builder.nav2_id); }
      const nav_actions = await db.game_actions.where('id').anyOf(ids).toArray();
      //delete effects and actions
      await AppLogicController.deleteEffectsByActionId(dispatch, nav_actions[0].id);
      await db.game_actions.where('id').equals(nav_actions[0].id).delete();
      if(nav_action_builder.two_way) {
        await AppLogicController.deleteEffectsByActionId(dispatch, nav_actions[1].id);
        await db.game_actions.where('id').equals(nav_actions[1].id).delete();
      }
      //delete builder
      await db.nav_action_builders.delete(id);
    }).then(result => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  //-- Interactive Actions --//
  static createNewInteractiveAction(dispatch, data) {
    let action = null;
    let noEffAction = null;
    let actionEffects;

    return db.transaction('rw', db.game_actions, db.effects, db.action_assoc, async () => {
      //create action and effects
      action = await db.game_actions.add({'type': 'inter', 'description': data.description, 'allow_repeat': data.allowRepeat, 'required_condition': data.requiredCondition, 'effects_display': data.actionEffects.json_display});
      actionEffects = data.actionEffects.effects.map((effect) => { effect.actionId = action; return effect; });
      await AppLogicController.createNewEffectsList(dispatch, actionEffects);
      if (data.hasAssociated) {
        //create new no-eff or associate existing
        let oppositeCond = ConditionEditorUtils.createOppositeCondition(JSON.parse(data.requiredCondition));
        if(data.associationType === 'create') {
          //create action
          noEffAction = await db.game_actions.add({'type': 'noeff', 'description': '[INVERSE OF: '+data.description+']', 'allow_repeat': data.allowRepeat, 'required_condition': JSON.stringify(oppositeCond)});
        } else {
          //update action req condition
          await AppLogicController.updateNoEffectActionCondition(dispatch, data.associationTo, {requiredCondition: JSON.stringify(oppositeCond)});
          noEffAction = data.associationTo;
        }
        //create action_assoc
        await db.action_assoc.add({'action1_id': action, 'action2_id': noEffAction});
      }
    }).then(result => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static deleteInteractiveAction(dispatch, id) {
    return db.transaction('rw', db.game_actions, db.effects, db.action_assoc, async () => {
      //delete effects
      await AppLogicController.deleteEffectsByActionId(dispatch, id);
      //find assoc
      const assoc = await db.action_assoc.where('action1_id').equals(id).first();
      if(assoc) {
        //delete no eff and assoc
        await AppLogicController.deleteNoEffectAction(dispatch, assoc.action2_id);
        await db.action_assoc.where('action1_id').equals(id).delete();
      }
      //delete action
      await db.game_actions.where('id').equals(id).delete();
    }).then(result => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  //-- Effects --//
  static createNewEffectsList(dispatch, data) {
    const effects = data.map(effect => {
      return {
        'action_id': effect.actionId,
        'order': effect.order, 
        'type': effect.type,
        'gsp_id': effect.gsp_id || null,
        'mutator': effect.mutatorId || null,
        'value': effect.value || null,
        'conv_id': effect.conv_id || null,
        'conv_at': effect.conv_at || null,
      };
    });
    return db.effects.bulkAdd(effects).then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static deleteEffectsByActionId(dispatch, id) {
    return db.effects.where('action_id').equals(id).delete().then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }


  //-- No-Effect Actions --//
  static createNewNoEffectAction(dispatch, data) {
    return db.game_actions.add({'type': 'noeff', 'description': data.description, 'required_condition': data.requiredCondition, 'allow_repeat': data.allowRepeat}).then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static updateNoEffectAction(dispatch, key, data) {
    return db.game_actions.update(key, {'type': 'noeff', 'description': data.description, 'required_condition': data.requiredCondition, 'allow_repeat': data.allowRepeat}).then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static updateNoEffectActionCondition(dispatch, key, data) {
    return db.game_actions.update(key, {'required_condition': data.requiredCondition}).then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static deleteNoEffectAction(dispatch, id) {
    return db.game_actions.delete(id).then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  //-- Conversations --//
  static createNewConversation(dispatch, data) {
    return db.conversations.add({'name': data.name, 'characters': ''}).then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static updateConversation(dispatch, key, data) {
    return db.conversations.update(key, {'name': data.name}).then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static updateConversationCharacters(dispatch, key, data) {
    return db.conversations.update(key, {'characters': data.characters}).then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static deleteConversation(dispatch, id) {
    return db.transaction('rw', db.conversations, db.conversation_dialogs, async () => {
      await db.conversation_dialogs.where('conversation_id').equals(id).delete();
      await db.conversations.delete(id);
    }).then(result => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static createNewConversationDialog(dispatch, data) {
    return db.transaction('rw', db.conversations, db.conversation_dialogs, async () => {
      await db.conversation_dialogs.add({'conversation_id': data.conversationId, 'order': data.order, 'dialog': data.dialog, 'character_id': data.characterId});
      const dialogs = await db.conversation_dialogs.where('conversation_id').equals(data.conversationId).toArray();
      await db.conversations.update(data.conversationId, {'characters': AppLogicUtils.rebuildConversationCharacterIds(dialogs)});
    }).then(result => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static updateConversationDialog(dispatch, key, data) {
    return db.transaction('rw', db.conversations, db.conversation_dialogs, async () => {
      //do not accept order update
      await db.conversation_dialogs.update(key, {'dialog': data.dialog, 'character_id': data.characterId});
      const dialogs = await db.conversation_dialogs.where('conversation_id').equals(data.conversationId).toArray();
      await db.conversations.update(data.conversationId, {'characters': AppLogicUtils.rebuildConversationCharacterIds(dialogs)});
    }).then(result => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static updateConversationDialogOrder(dispatch, key, data) {
    return db.transaction('rw', db.conversation_dialogs, async () => {
      const affectedConversationDialog = await db.conversation_dialogs.where({conversation_id: data.conversationId, order: data.order}).first();
      await db.conversation_dialogs.update(key, {'order': data.order});
      await db.conversation_dialogs.update(affectedConversationDialog.id, {'order': data.oldOrder});
    }).then(result => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  static deleteConversationDialog(dispatch, id, conversationId) {
    return db.transaction('rw', db.conversations, db.conversation_dialogs, async () => {
      let newBaseOrder = null;
      let affectedConversationDialogs = [];
      const conversationDialogs = await db.conversation_dialogs.where('conversation_id').equals(conversationId).toArray();
      const orderedConversationDialogs = conversationDialogs.sort((a, b) => { return a.order - b.order; });
      await orderedConversationDialogs.forEach(dialog => {
        if(newBaseOrder !== null){
          affectedConversationDialogs.push({key: dialog.id, order: newBaseOrder + affectedConversationDialogs.length});
        }
        if(dialog.id === id){
          newBaseOrder = dialog.order;
        }
      });
      await db.conversation_dialogs.delete(id);
      affectedConversationDialogs.forEach(async (affected) => {
        await db.conversation_dialogs.update(affected.key, {'order': affected.order});
      });
      const conversationDialogsAfterRemove = await db.conversation_dialogs.where('conversation_id').equals(conversationId).toArray();
      await db.conversations.update(conversationId, {'characters': AppLogicUtils.rebuildConversationCharacterIds(conversationDialogsAfterRemove)});
    }).then(result => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  //-- Run Configurations --//
  static setRunConfiguration(dispatch, data) {
    return db.run_configurations.put({'name': data.name, 'value': data.value}, data.name).then(() => {
      //
    }).catch(error => {
      console.log('||--FAIL', error);
      //return reject to allow catch chain
      return Promise.reject(error);
    });
  }

  //---------------------------------------//
  //------------- Play Mode ---------------//
  //---------------------------------------//
  static startNewPlayTestRun(dispatch) {
    return db.transaction('rw', db.play_game_state_props, db.game_state_props, db.default_entity_colors, db.custom_entity_defs, async () => {
      //get default and custom colors
      const defaultColors = await db.default_entity_colors.toArray();
      const customEntityColors = await db.custom_entity_defs.toArray();
      //clear play_game_state_props
      await db.play_game_state_props.clear();
      //copy all game_state_props to play_game_state_props and set values to defaults and prev to null
      const gsps = await db.game_state_props.toArray();
      let playProps = gsps.map(gsp => {
        return {
          'game_state_prop_id': gsp.id,
          'name': gsp.name, 
          'type': gsp.type,
          'ref_table': gsp.default_table,
          'value': gsp.default,
          'prev_value': null,
          'tids': gsp.default_tids,
          'prev_tids': null,
          'color': AppLogicUtils.getPropRelatedColor(gsp.name, gsp.type, defaultColors, customEntityColors),
        };
      });
      await db.play_game_state_props.bulkAdd(playProps);
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