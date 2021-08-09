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
      };
    case 'SET_STORY_NOT_RUNNABLE':
      return {
        ...state,
        storyVerifyingRunnable: false,
        storyRunnable: false,
      };
    case 'SET_STORY_RUNNABLE':
      return {
        ...state,
        storyVerifyingRunnable: false,
        storyRunnable: true,
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
