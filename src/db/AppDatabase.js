import Dexie from 'dexie';


const db = new Dexie('RpgspDatabase');

db.version(1).stores({
    stories: '++id',                                //title, version
    game_state_props: '++id, name',                 //type, default, removable
    locations: '++id',                              //name, description
    areas: '++id, location_id',                     //name, description
    characters: '++id',                             //name, description
    custom_entity_defs: '++id',                     //name, key, singular_name
    custom_entities: '++id, custom_entity_def_id',  //name, description
});


export const testDatabase = () => {
  return db.open();
};

export default db;
