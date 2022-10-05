import Dexie from 'dexie';


const db = new Dexie('RpgspDatabase');

db.version(1).stores({
    //config
    stories: '++id',                                //title, version
    game_state_props: '++id, name',                 //type, default, edit_mode, removable, default_table, default_tids
    locations: '++id, name',                        //description, map
    areas: '++id, location_id, name',               //description, color, sound
    characters: '++id, name',                       //description, is_pc, color, image
    custom_entity_defs: '++id, singular_name',      //name, key, color
    custom_entities: '++id, custom_entity_def_id, name',  //description
    default_entity_colors: '++id',                  //name, color
    //story setup
    chapters: '++id, order',                        //name, description
    acts: '++id, order, chapter_id, type',          //name, description, end_condition
    sequenced_actions: '++id, act_id, order',       //text_value, type, character_id

    //navigation_actions: '++id',                   //description, effects
    //interactive_actions: '++id',                  //description, effects
    //no_effect_actions: '++id',                    //description, effects

    game_actions: '++id, type',                     //description, allow_repeat, required_condition, effects_display

    effects: '++id, action_id, order, type',        //conv_id, conv_at, gsp_id, mutator, value
    action_assoc: 'action1_id, action2_id',

    nav_action_builders: '++id, nav1_id, nav2_id',  //area1, area2, two_way

    conversations: '++id',                          //name, characters
    conversation_dialogs: '++id, conversation_id, order',  //dialog, character_id


    run_configurations: 'name, value',
    //play-mode
    play_game_state_props: 'game_state_prop_id, name', //type, value, prev_value, color, ref_table, tids, prev_tids
});

//default_entity_colors for: locations, areas, characters

//game_state_props.edit_mode = (string) "none|all|name|type|default"

//act.type = (string) "sequence|interactive"

//sequenced_action.type = (string) "description|dialog"

//game_actions.type = (string) "nav|noeff|inter"
//nav = in navigation tab, must have area change in effects (currentArea)
//noeff = no effect allowed
//inter = no area change allowed (currentArea)

//nav_action_builders.nav1_id and nav_action_builders.nav2_id are game_actions

//game_actions.required_condition = (json)
// {
//    mode: "simple|complex",
//    expressions: [
//      { gsp_id: (id), compId: (id), value: (multiple), valueDisplay: (string|null)},
//    ],
//    logic_func: (object), (for complex only)
//    display: [{type: 'exp', propName: (string), comp: (string), value: (multiple)}], (single)
//    display: [{type: 'exp', propName: (string), comp: (string), value: (multiple)}, {type: 'logic', name: (string)}, {type: 'grouping', name: (string)}], (complex)
// }

//conversations.characters = (string) "|1|4|9|" (character ids)


export const testDatabase = () => {
  return db.open();
};

export default db;
