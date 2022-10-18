import "./App.scss";
import React from "react";
import { Theme, Loading } from "@carbon/react";
import Routes from "./router";
import DefaultHeader from "./components/DefaultHeader";
import GlobalStateProvider from "./hooks/globalState";

function App() {
  return (
    <GlobalStateProvider>
      <Routes>
        <Theme theme={"g100"}>
          <DefaultHeader />
        </Theme>
      </Routes>
    </GlobalStateProvider>
  );
}

export default App;
