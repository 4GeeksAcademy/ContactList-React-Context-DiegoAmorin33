import React, { createContext, useReducer } from "react";
import { useGlobalReducer } from "./hooks/useGlobalReducer";

export const Context = createContext();

export const StoreProvider = ({ children }) => {
  const initialState = {
    contacts: [],
    agenda_slug: "dieguin_agenda"
  };

  const [state, dispatch] = useReducer(useGlobalReducer, initialState);

  return (
    <Context.Provider value={{ store: state, actions: { dispatch } }}>
      {children}
    </Context.Provider>
  );
};
