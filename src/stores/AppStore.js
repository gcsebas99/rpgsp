import React, {createContext, useReducer} from "react";
import AppReducer from './AppReducer'

const initialState = {
  initialCheckDone: false,
  databaseLoadError: false,
  storyLoadError: false,
  storyErrorMessage: null,
  storyLoaded: false,
  page: 'EMPTY',
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