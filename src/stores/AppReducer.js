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
        storyLoadError: true,
        storyErrorMessage: action.payload || null,
      };
    case 'SET_APP_PAGE':
      return {
        ...state,
        page: action.payload,
      };
    case 'SET_STORY_LOADED':
      return {
        ...state,
        storyLoaded: action.payload,
        page: (action.payload ? 'CONFIG' : 'EMPTY'),
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
