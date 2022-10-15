import "./App.scss";
import React from "react";
import { Theme } from "@carbon/react";
import Routes from "./router";
import DefaultHeader from "./components/DefaultHeader";

function App() {
  return (
    <>
      <Theme theme={"g100"}>
        <DefaultHeader />
      </Theme>
      <Routes />
    </>
  );
}

export default App;
