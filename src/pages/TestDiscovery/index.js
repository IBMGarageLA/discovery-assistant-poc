import React from "react";
import TestZone from "../../components/TestZone";
import SearchResults from "../../components/SearchResults";
import { Grid, Column, Loading } from "@carbon/react";
import { useGlobalState } from "../../hooks/globalState";
import DiscoveryViewer from "../../components/DiscoveryViewer";

function TestDiscovery() {
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
