import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
} from "react-router-dom";

// Pages import
import Upload from "./pages/Upload";
import TestDiscovery from "./pages/TestDiscovery";
import Chat from "./pages/Chat";
import { useGlobalState } from "./hooks/globalState";
import { getUser } from "./services/uploadFile";
import PdfViewer from "./components/PdfViewer";
import DiscoveryViewer from "./components/DiscoveryViewer";

function Routes({ children }) {
  const { setLoggedUser } = useGlobalState();

  const getLoggedUser = async () => {
    try {
      const user = await getUser();
      setLoggedUser(user);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getLoggedUser();
  }, []);

  return (
    <Router>
      {children}
      <Switch>
        <Route path="" element={<Upload />} />
        <Route path="test-discovery" element={<TestDiscovery />} />
        <Route path="chat" element={<Chat />} />
        {/* <Route path="test" element={<DiscoveryViewer />} /> */}
      </Switch>
    </Router>
  );
}

export default Routes;
