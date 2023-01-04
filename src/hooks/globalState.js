import React, { createContext, useContext, useState } from "react";

const GlobalStateContext = createContext({});

export default function GlobalStateProvider({ children }) {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [loggedUser, setLoggedUser] = useState({});
  const [searchText, setSearchText] = useState(null);
  const [company, setCompany] = useState(null);
  const [doc, setDoc] = useState({});

  return (
    <GlobalStateContext.Provider
      value={{
        searchResults,
        setSearchResults,
        loading,
        setLoading,
        loadingDoc,
        setLoadingDoc,
        loggedUser,
        setLoggedUser,
        searchText,
        setSearchText,
        company,
        setCompany,
        doc,
        setDoc,
      }}
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
