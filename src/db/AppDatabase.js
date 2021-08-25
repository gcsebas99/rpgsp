import Dexie from 'dexie';


const db = new Dexie('RpgspDatabase');

db.version(1).stores({
    stories: '++id',                                //title, version
    game_state_props: '++id, name',                 //type, default, edit_mode, removable, default_table, default_tids
    locations: '++id, name',                        //description, map
    areas: '++id, location_id, name',               //description, color
    characters: '++id, name',                       //description, is_pc, color
    custom_entity_defs: '++id, singular_name',      //name, key, color
    custom_entities: '++id, custom_entity_def_id, name',  //description
    default_entity_colors: '++id',                  //name, color
    //
    chapters: '++id, order',                        //name, description
    acts: '++id, order, chapter_id, type',          //name, description
});

//default_entity_colors for: locations, areas, characters

//game_state_props.edit_mode = (string) "none|all|name|type|default"

//act.type = (string) "sequence|interactive"


export const testDatabase = () => {
  return db.open();
};

export default db;
