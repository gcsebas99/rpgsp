const AppReducer = (state, action) => {
  switch (action.type) {
    case 'SET_APP_INITIAL_CHECK_DONE':
      return {
        ...state,
        initialCheckDone: true,
        };
    case 'SET_APP_DATABASE_LOAD_ERROR':
      return {
        ...state,
        databaseLoadError: true,
        initialCheckDone: true,
      };
    case 'SET_APP_STORY_LOAD_ERROR':
      return {
        ...state,
        globalLoading: false,
        storyLoadError: true,
        storyErrorMessage: action.payload || null,
      };
    case 'SET_APP_PAGE':
      return {
        ...state,
        page: action.payload,
      };
    case 'SET_APP_GLOBAL_LOADING':
      return {
        ...state,
        globalLoading: action.payload || false,
      };
    case 'SET_STORY_LOADED':
      return {
        ...state,
        globalLoading: false,
        storyLoaded: action.payload,
        storyRunnable: false,
        page: (action.payload ? 'CONFIG' : 'EMPTY'),
      };
    case 'SET_STORY_VERIFYING_RUNNABLE':
      return {
        ...state,
        storyVerifyingRunnable: true,
        storyRunnable: false,
        storyVerifications: {},
      };
    case 'SET_STORY_NOT_RUNNABLE':
      return {
        ...state,
        storyVerifyingRunnable: false,
        storyRunnable: false,
        storyVerifications: action.payload,
      };
    case 'SET_STORY_RUNNABLE':
      return {
        ...state,
        storyVerifyingRunnable: false,
        storyRunnable: true,
        storyVerifications: action.payload,
      };
    case 'UNSET_ACTIVE_CONDITION':
      return {
        ...state,
        activeConditionDone: false,
        activeCondition: null,
        conditionEditorMode: null,
      };
    case 'SET_ACTIVE_CONDITION':
      return {
        ...state,
        activeConditionDone: false,
        activeCondition: action.payload,
      };
    case 'SET_ACTIVE_CONDITION_COMPLETED':
      return {
        ...state,
        activeConditionDone: true,
        activeCondition: action.payload,
      };
    case 'UNSET_ACTIVE_CONDITION_MODE':
      return {
        ...state,
        conditionEditorMode: null,
      };
    case 'SET_ACTIVE_CONDITION_MODE':
      return {
        ...state,
        conditionEditorMode: action.payload,
      };
    case 'UNSET_ACTIVE_EFFECTS':
      return {
        ...state,
        activeEffectsDone: false,
        activeEffects: null,
      };
    case 'SET_ACTIVE_EFFECTS':
      return {
        ...state,
        activeEffectsDone: false,
        activeEffects: action.payload,
      };
    case 'SET_ACTIVE_EFFECTS_COMPLETED':
      return {
        ...state,
        activeEffectsDone: true,
        activeEffects: action.payload,
      };
    case 'SET_RUN_CONFIGURATIONS':
      return {
        ...state,
        runConfigurations: action.payload,
      };

    // case 'ADD_POST':
    //     return {
    //         ...state,
    //         posts: state.posts.concat(action.payload)
    //     };
    // case 'REMOVE_POST':
    //     return {
    //         ...state,
    //         posts: state.posts.filter(post => post.id !== action.payload)
    //     };
    // case 'SET_ERROR':
    //     return {
    //         ...state,
    //         error: action.payload
    //     };
    default:
        return state;
  }
};

export default AppReducer;
