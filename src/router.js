import React from "react";
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
} from "react-router-dom";

// Pages import
import Upload from "./pages/Upload";
import TestDiscovery from "./pages/TestDiscovery";

function Routes({ children }) {
  return (
    <Router>
      {children}
      <Switch>
        <Route path="/" element={<Upload />} />
        <Route path="/test-discovery" element={<TestDiscovery />} />
      </Switch>
    </Router>
  );
}

export default Routes;
