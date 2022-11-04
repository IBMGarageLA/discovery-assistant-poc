import {
  Search,
  Form,
  FormGroup,
  Stack,
  Select,
  SelectItem,
  Button,
  usePrefix,
} from "@carbon/react";
import React, { useState } from "react";
import { searchText as doSearch } from "../../services/uploadFile";
import { useGlobalState } from "../../hooks/globalState";
import "./styles.scss";

const availableCompanies = [
  {
    value: "adp",
    text: "ADP",
  },
  {
    value: "company-x",
    text: "Company X",
  },
  {
    value: "ibm",
    text: "IBM",
  },
];

function SearchInput(props) {
  return (
    <div className={`my--search--item`}>
      <p className={`${props.prefix}--file--label`}>{props.labelTitle}</p>
      <p className={`${props.prefix}--label-description`}>
        {props.labelDescription}
      </p>
      <Search
        closeButtonLabelText="Clear search input"
        id="search-1"
        labelText="Search"
        size="md"
        onChange={props.onChange}
      />
    </div>
  );
}

function SelectInput(props) {
  return (
    <Select {...props}>
      <SelectItem
        disabled
        hidden
        value="placeholder-item"
        text="Choose an option"
      />
      {props.items.map(({ value, text }, index) => (
        <SelectItem key={index} value={value} text={text} />
      ))}
    </Select>
  );
}

function TestZone(props) {
  const prefix = usePrefix();
  const [searchText, setSearchText] = useState(null);
  const [company, setCompany] = useState(null);
  const { setSearchResults, setLoading } = useGlobalState();

  function handleCompanySelection(e) {
    e.preventDefault();

    const selectedCompany = e.target?.value;

    setCompany(selectedCompany);
  }

  function handleSearchChange(e) {
    e.preventDefault();

    const text = e.target?.value;

    setSearchText(text);
  }

  async function handleSearch(e) {
    e.preventDefault();

    try {
      setLoading(true);
      const result = await doSearch(company, searchText);
      setSearchResults(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form>
      <Stack gap={7}>
        <FormGroup legendText={""}>
          <SearchInput
            prefix={prefix}
            labelTitle={"Search"}
            labelDescription={
              "Type your question in the search field below and select the company from the list."
            }
            onChange={handleSearchChange}
          />
        </FormGroup>

        <FormGroup legendText={""}>
          <SelectInput
            id={"select-1"}
            defaultValue="placeholder-item"
            labelText="Select a company"
            items={availableCompanies}
            disabled={searchText?.length > 10 ? false : true}
            onChange={handleCompanySelection}
          />
        </FormGroup>

        <FormGroup legendText={""}>
          <Button onClick={handleSearch}>Search</Button>
        </FormGroup>
      </Stack>
    </Form>
  );
}

export default TestZone;
