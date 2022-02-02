import db from '../db/AppDatabase';

//Controls data fetch operation (read DB only)
class AppDataFetchController {

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

  //act live
  static fetchLiveAct(actId) {
    return () => db.acts.where('id').equals(actId ? actId : -1).first();
  }

  //chapter live
  static fetchLiveChapter(chapterId) {
    return () => db.chapters.where('id').equals(chapterId ? chapterId : -1).first();
  }

  //act's sequenced actions live
  static fetchLiveSequencedActionsByAct(actId) {
    return () => db.sequenced_actions.where('act_id').equals(actId ? actId : -1).toArray();
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

  //no-effect actions live
  static fetchLiveNoEffectActions(filters) {
    if(filters.character && filters.character !== -1) {
      //let regex = new RegExp(',' + filters.character + ',');
      //return () => db.conversations.filter(conversation => { return regex.test(conversation.characters); }).toArray();
    } else {
      return () => db.game_actions.where('type').equals('noeff').toArray();
    }
  }

}

export default AppDataFetchController;