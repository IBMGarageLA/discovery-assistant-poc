import React from "react";
import {
  Header,
  HeaderName,
  SkipToContent,
  HeaderNavigation,
  HeaderMenuItem,
} from "@carbon/react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";

function HighlightableHeaderMenuItem({ element = Link, to = "/", children }) {
  const resolvePath = useResolvedPath(to);
  const activeItem = useMatch({ path: resolvePath.pathname, end: true });

  return (
    <HeaderMenuItem
      className={activeItem ? "active-menu-item" : ""}
      isCurrentPage={activeItem ? true : false}
      element={element}
      to={to}
    >
      {children}
    </HeaderMenuItem>
  );
}

function DefaultHeader() {
  return (
    <Header aria-label="IBM Platform Name">
      <SkipToContent />
      <HeaderName href="#" prefix="[IBM]">
        Watson Discovery
      </HeaderName>
      <HeaderNavigation aria-label="[IBM] Watson Discovery">
        <HighlightableHeaderMenuItem to="/">
          Upload Document
        </HighlightableHeaderMenuItem>
        <HighlightableHeaderMenuItem to="/test-discovery">
          Test Discovery
        </HighlightableHeaderMenuItem>
      </HeaderNavigation>
    </Header>
  );
}

export default DefaultHeader;
