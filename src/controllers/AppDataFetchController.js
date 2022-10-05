import db from '../db/AppDatabase';

//Controls data fetch operation (read DB only)
class AppDataFetchController {

  //run configurations
  static async loadRunConfigurations(dispatch) {
    const configs = await db.run_configurations.toArray();
    if (configs !== undefined) {
      let configList = {};
      configs.forEach(config => {
        configList[config.name] = config.value;
      });
      dispatch({type: 'SET_RUN_CONFIGURATIONS', payload: configList});
    }
  }

  //GSP
  static async fetchGameStateProps() {
    return db.game_state_props.toArray();
  }

  static fetchPlayGameStateProps(propNames = null, liveQuery = false) {
    if(propNames !== null) {
      const singleProp = propNames.length === 1;
      if(liveQuery) {
        if(singleProp) {
          return () => db.play_game_state_props.where('name').anyOf(propNames).first();
        } else {
          return () => db.play_game_state_props.where('name').anyOf(propNames).toArray();
        }
      } else {
        if(singleProp) {
          return db.play_game_state_props.where('name').anyOf(propNames).first();
        } else {
          return db.play_game_state_props.where('name').anyOf(propNames).toArray();
        }
      }
    } else {
      //all props
      if(liveQuery) {
        return () => db.play_game_state_props.toArray();
      } else {
        return db.play_game_state_props.toArray();
      }
    }
  }


  //fetch all entities per type (location,area,character,custom)
  static async fetchStoryEntities(type) {
    if(type === 'location' || type === 'area' || type === 'character') {
      const tableName = type + 's';
      if(type === 'location' || type === 'character') {
        return db[tableName].toArray();
      } else { //list areas with its location name
        return db.transaction('r', tableName, 'locations', async () => {
          const locations = await db.locations.toArray();
          const areas = await db[tableName].toArray();
          return areas.map(area => {
            area.displayName = area.name + ' (' + locations.find(location => location.id === area.location_id).name + ')';
            return area;
          });
        });
      }
    } else { //custom entity
      return db.transaction('r', 'custom_entity_defs', 'custom_entities', async () => {
        const entityDef = await db.custom_entity_defs.where({singular_name: type}).first();
        return db.custom_entities.where({custom_entity_def_id: entityDef.id}).toArray();
      });
    }
  }

  //fetch all sequenced acts
  static async fetchSequencedActs() {
    return db.acts.where({type: 'sequence'}).toArray();
  }

  //fetch areas by location
  static async fetchAreasByLocation(locationId) {
    return db.areas.where({location_id: locationId}).toArray();
  }

  //storyline
  static async fetchStoryline() {
    return db.transaction('r', db.chapters, db.acts, async () => {
      const chapters = await db.chapters.orderBy('order').toArray();
      const acts = await db.acts.toArray();
      return chapters.map(chapter => {
        chapter.acts = acts.filter(act => act.chapter_id === chapter.id).sort((a, b) => (a.order > b.order) ? 1 : -1);
        return chapter;
      });
    });
  }

  //chapters count
  static async chaptersCount() {
    return db.chapters.count();
  }

  //chapter by order
  static async chapterByOrder(order) {
    return db.chapters.where('order').equals(order).first();
  }

  //acts count
  static async actsByChapterCount(chapter_id) {
    return db.acts.where('chapter_id').equals(chapter_id).count();
  }

  //location live
  static fetchLiveLocation(locationId) {
    return () => db.locations.where('id').equals(locationId ? locationId : -1).first();
  }

  //location live
  static fetchLiveArea(areaId) {
    return () => db.areas.where('id').equals(areaId ? areaId : -1).first();
  }

  //act live
  static fetchLiveAct(actId) {
    return () => db.acts.where('id').equals(actId ? actId : -1).first();
  }

  //chapter live
  static fetchLiveChapter(chapterId) {
    return () => db.chapters.where('id').equals(chapterId ? chapterId : -1).first();
  }

  //act's sequenced actions
  static async fetchSequencedActionsByAct(actId) {
    const acts = await db.sequenced_actions.where('act_id').equals(actId ? actId : -1).toArray();
    return acts.sort((a, b) => (a.order > b.order) ? 1 : -1);
  }

  //act's sequenced actions live
  static fetchLiveSequencedActionsByAct(actId) {
    return () => db.sequenced_actions.where('act_id').equals(actId ? actId : -1).toArray();
  }

  //conversations static
  static async fetchConversations() {
    return db.conversations.toArray();
  }

  //conversations live
  static fetchLiveConversations(filters) {
    if(filters.character && filters.character !== -1) {
      let regex = new RegExp(',' + filters.character + ',');
      return () => db.conversations.filter(conversation => { return regex.test(conversation.characters); }).toArray();
    } else {
      return () => db.conversations.toArray();
    }
  }

  //conversation dialogs live
  static fetchLiveConversationDialogs(conversationId) {
    return () => db.conversation_dialogs.where('conversation_id').equals(conversationId ? conversationId : -1).toArray();
  }

  //no-effect actions static
  static async fetchNoEffectActions() {
    return db.game_actions.where('type').equals('noeff').toArray();
  }

  //no-effect actions live
  static fetchLiveNoEffectActions(filters) {
    if(filters.character && filters.character !== -1) {
      //let regex = new RegExp(',' + filters.character + ',');
      //return () => db.conversations.filter(conversation => { return regex.test(conversation.characters); }).toArray();
    } else {
      return () => db.game_actions.where('type').equals('noeff').toArray();
    }
  }

  //navigation actions live
  static fetchLiveNavigationActions(filters) {
    if(filters.character && filters.character !== -1) {
      //let regex = new RegExp(',' + filters.character + ',');
      //return () => db.conversations.filter(conversation => { return regex.test(conversation.characters); }).toArray();
    } else {
      return () => db.game_actions.where('type').equals('nav').toArray();
    }
  }

  //navigation actions by ids live
  static fetchLiveNavigationActionsByIds(ids) {
    return () => db.game_actions.where('id').anyOf(ids).toArray();
  }

  //nav builders live
  static fetchLiveNavBuilders(filters) {
    if(filters.character && filters.character !== -1) {
      // let regex = new RegExp(',' + filters.character + ',');
      // return () => db.conversations.filter(conversation => { return regex.test(conversation.characters); }).toArray();
    } else {
      return () => db.nav_action_builders.toArray();
    }
  }

  //interactive actions live
  static fetchLiveInteractiveActions(filters) {
    if(filters.character && filters.character !== -1) {
      //let regex = new RegExp(',' + filters.character + ',');
      //return () => db.conversations.filter(conversation => { return regex.test(conversation.characters); }).toArray();
    } else {
      return () => {
        return db.transaction('r', 'game_actions', 'action_assoc', async () => {
          const results = await db.game_actions.where('type').equals('inter').toArray();
          //get assoc actions
          const interActions = results.map(async (action) => {
            action.assocNoEff = null;
            const assoc = await db.action_assoc.where('action1_id').equals(action.id).first();
            if(assoc) {
              action.assoc_no_eff = await db.game_actions.where('id').equals(assoc.action2_id).first();
            }
            return action;
          });
          const res = await Promise.all(interActions);
          return res;
        });
      }
    }
  }

  //run configuration by name
  static async fetchRunConfiguration(name) {
    return db.run_configurations.where('name').equals(name).first();
  }

}

export default AppDataFetchController;