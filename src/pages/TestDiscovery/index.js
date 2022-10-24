import React, { useEffect } from "react";
import TestZone from "../../components/TestZone";
import SearchResults from "../../components/SearchResults";
import { Grid, Column, Loading } from "@carbon/react";
import { useGlobalState } from "../../hooks/globalState";


function TestDiscovery() {
  useEffect(() => {
    window.watsonAssistantChatOptions = {
      integrationID: "5cd125ba-39e7-44d7-8f5c-5beb1e06b74a", // The ID of this integration.
      region: "us-east", // The region your integration is hosted in.
      serviceInstanceID: "cc1f0253-ba59-4cbd-9730-8926b4d42087", // The ID of your service instance.
      onLoad: function(instance) { instance.render(); }
    };
    const t=document.createElement('script');
    t.src="https://web-chat.global.assistant.watson.appdomain.cloud/versions/" + (window.watsonAssistantChatOptions.clientVersion || 'latest') + "/WatsonAssistantChatEntry.js";
    document.head.appendChild(t);
  }, []);
  
  const { searchResults, loading } = useGlobalState();

  return (
    <div className="container">
      {loading && <Loading />}
      <Grid fullWidth>
        <Column sm={4} md={8} lg={8}>
          <TestZone />
        </Column>
        <Column sm={4} md={8} lg={8}>
          <SearchResults data={searchResults} />
        </Column>
      </Grid>
    </div>
  );
}

export default TestDiscovery;
