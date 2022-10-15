import React from "react";
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
} from "react-router-dom";

// Pages import
import Upload from "./pages/Upload";

function Routes() {
  return (
    <Router>
      <Switch>
        <Route path="/" element={<Upload />} />
      </Switch>
    </Router>
  );
}

export default Routes;
