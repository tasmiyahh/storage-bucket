import React, { createContext, useReducer } from 'react'
import { reducer } from './reducer';
export const GlobalContext = createContext("InitialValue");
let InitialValue  = {
  user: {},
  darkTheme: true
}
function ContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, InitialValue)
  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  )
}

export default ContextProvider;