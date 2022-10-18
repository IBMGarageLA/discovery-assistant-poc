import React, { createContext, useContext, useState } from "react";

const GlobalStateContext = createContext({});

export default function GlobalStateProvider({ children }) {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <GlobalStateContext.Provider
      value={{ searchResults, setSearchResults, loading, setLoading }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  const context = useContext(GlobalStateContext);

  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }

  return context;
}
