import React, {createContext, useReducer} from "react";
import AppReducer from './AppReducer'

const initialState = {
  initialCheckDone: false,
  globalLoading: false,
  databaseLoadError: false,
  storyLoadError: false,
  storyErrorMessage: null,
  storyLoaded: false,
  storyVerifyingRunnable: false,
  storyRunnable: false,
  page: 'EMPTY',
  //
  activeConditionDone: false,
  activeCondition: null,
};

const AppStore = ({children}) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);
    return (
        <AppContext.Provider value={[state, dispatch]}>
            {children}
        </AppContext.Provider>
    )
};

export const AppContext = createContext(initialState);
export default AppStore;