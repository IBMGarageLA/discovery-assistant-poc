import React from "react";
import { Header, HeaderName, SkipToContent } from "@carbon/react";

function DefaultHeader() {
  return (
    <Header aria-label="IBM Platform Name">
      <SkipToContent />
      <HeaderName href="#" prefix="[IBM]">
        Watson Discovery
      </HeaderName>
    </Header>
  );
}

export default DefaultHeader;
