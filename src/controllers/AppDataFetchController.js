import db from '../db/AppDatabase';

//Controls data fetch operation (read DB only)
class AppDataFetchController {

  static async fetchGameStateProps() {
    return db.game_state_props.toArray();
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

}

export default AppDataFetchController;