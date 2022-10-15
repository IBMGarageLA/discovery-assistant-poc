import {
  FileUploader,
  Form,
  FormGroup,
  Stack,
  Select,
  SelectItem,
  Button,
} from "@carbon/react";
import React, { useEffect, useState } from "react";
import uploadFile from "../../services/uploadFile";

const availableCompanies = [
  {
    value: "adp",
    text: "ADP",
  },
  {
    value: "client-eng",
    text: "Client Engineering",
  },
  {
    value: "ibm",
    text: "IBM",
  },
];

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

function UploadZone(props) {
  const [file, setFile] = useState(null);
  const [company, setCompany] = useState(null);
  const [fileStatus, setFileStatus] = useState("edit");

  function handleUpload(e) {
    e.preventDefault();

    const newFile = Object.values(e.target?.files)[0] || {};

    setFile(newFile);
  }

  function handleDelete(e) {
    e.preventDefault();
    setFile(null);
  }

  function handleCompanySelection(e) {
    e.preventDefault();
    const newCompany = e.target?.value || "";
    setCompany(newCompany);
  }

  async function handleUploadSubmit(e) {
    e.preventDefault();
    props.loadingHandler(true);

    try {
      setFileStatus("uploading");

      const metadata = { company: company };

      const result = await uploadFile(file, metadata);

      if (result.success) {
        setFileStatus("complete");
        props.notificationHandler(
          "success",
          "Upload Completed",
          "Your file was successful uploaded and the processing is running"
        );
      } else {
        setFileStatus("edit");
        props.notificationHandler(
          "error",
          "Upload Error",
          "An error occurred when uploading your file"
        );
      }

      props.loadingHandler(false);
    } catch (error) {
      console.error(error);

      setFileStatus("edit");

      props.notificationHandler(
        "error",
        "Upload Error",
        "An error occurred when uploading your file"
      );

      props.loadingHandler(false);
    }
  }

  return (
    <Form>
      <Stack gap={7}>
        <FormGroup legendText="">
          <FileUploader
            accept={[".pdf", ".docs", ".docx"]}
            buttonLabel="Add file"
            filenameStatus={fileStatus}
            iconDescription="Delete file"
            labelDescription="Max file size is 1MB. Only .pdf, .doc and .docx files are supported."
            labelTitle="Upload files"
            multiple={false}
            name=""
            onChange={handleUpload}
            onClick={function noRefCheck() {}}
            onDelete={handleDelete}
            role="button"
            size="md"
          />
        </FormGroup>
        <FormGroup legendText={""}>
          <SelectInput
            id={"select-1"}
            defaultValue="placeholder-item"
            labelText="Select a company"
            items={availableCompanies}
            disabled={file ? false : true}
            onChange={handleCompanySelection}
          />
        </FormGroup>
        <FormGroup legendText={""}>
          <Button
            disabled={file && company ? false : true}
            onClick={handleUploadSubmit}
          >
            Upload
          </Button>
        </FormGroup>
      </Stack>
    </Form>
  );
}

export default UploadZone;
