import React, { useEffect, useState } from "react";
import {
  Select,
  SelectItem,
  Grid,
  Column,
  Form,
  Stack,
  FormGroup,
  Button,
} from "@carbon/react";
import { WebChatContainer } from "@ibm-watson/assistant-web-chat-react";

const availableCompanies = [
  {
    value: "adp",
    text: "ADP",
  },
  {
    value: "ibm",
    text: "IBM",
  },
  {
    value: "company-x",
    text: "Company X",
  },
  {
    value: "company-y",
    text: "Company Y",
  },
  {
    value: "company-z",
    text: "Company Z",
  },
];

const webChatOptions = {
  integrationID: "5cd125ba-39e7-44d7-8f5c-5beb1e06b74a", // The ID of this integration.
  region: "us-east", // The region your integration is hosted in.
  serviceInstanceID: "cc1f0253-ba59-4cbd-9730-8926b4d42087", // The ID of your service instance.
};

function SelectInput(props) {
  return (
    <div className={`my--search--item`}>
      <p className={`${props.prefix}--file--label`}>{props.labelTitle}</p>
      <p className={`${props.prefix}--label-description`}>
        {props.labelDescription}
      </p>
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
    </div>
  );
}

function Chat() {
  const [company, setCompany] = useState(null);
  const [webChatInstance, setWebChatInstance] = useState(null);
  const [loadChat, setLoadChat] = useState(false);

  function preSendHandler(e) {
    e.data.context.skills["main skill"].user_defined = {
      company: `metadata.company::${company}`,
    };
  }

  useEffect(() => {
    if (company && webChatInstance) {
      webChatInstance.on({ type: "pre:send", handler: preSendHandler });
    }
  }, [company, webChatInstance]);

  function beforeChatRender(instance) {
    instance.on({ type: "pre:send", handler: preSendHandler });

    setWebChatInstance(instance);
  }

  function handleCompanySelection(e) {
    e.preventDefault();

    const selectedCompany = e.target?.value;

    setCompany(selectedCompany);
  }

  function handleLoadButton(e) {
    e.preventDefault();

    if (webChatInstance) {
      webChatInstance.restartConversation();
    } else {
      setLoadChat(true);
    }
  }

  return (
    <div className="container">
      <Grid>
        <Column sm={4} md={8} lg={8}>
          <Form>
            <Stack gap={7}>
              <FormGroup legendText={""}>
                <SelectInput
                  items={availableCompanies}
                  id={"select-1"}
                  defaultValue="placeholder-item"
                  labelText="Select a company"
                  onChange={handleCompanySelection}
                />
              </FormGroup>

              <FormGroup legendText={""}>
                <Button disabled={!company} onClick={handleLoadButton}>
                  {webChatInstance ? "Relaunch Chat" : "Launch Chat"}
                </Button>
              </FormGroup>
            </Stack>
          </Form>
        </Column>
      </Grid>
      {loadChat && (
        <WebChatContainer
          config={webChatOptions}
          onBeforeRender={beforeChatRender}
        />
      )}
    </div>
  );
}
export default Chat;
