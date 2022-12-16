import {
  setPdfJsGlobalWorkerOptions,
  DocumentPreview,
} from "@ibm-watson/discovery-react-components";
import { useEffect, useState } from "react";
import { getDocument } from "../../services/uploadFile";

import "./styles.scss";

const PDF_WORKER_URL = "./assets/pdf.worker.min.js";

setPdfJsGlobalWorkerOptions({ pathToPdfJS: PDF_WORKER_URL });

const fallbackComponent = () => {
  return <h1>ERRO</h1>;
};

/**
 * Documentation available on
 * https://watson-developer-cloud.github.io/discovery-components/storybook/?path=/docs/documentpreview--passage-highlighting
 * https://github.com/watson-developer-cloud/discovery-components
 */
const DiscoveryViewer = () => {
  const [file, setFile] = useState(null);

  const getDocumentBuffer = async (filename) => {
    try {
      const doc = await fetch("http://localhost:3001/test.pdf");
      const fileBuffer = await doc.arrayBuffer();

      console.log(fileBuffer);
      setFile(fileBuffer);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDocumentBuffer();
  }, []);

  const changeHandler = (e) => {
    console.log(e);
  };

  return (
    <>
      {file && (
        <DocumentPreview
          file={file}
          fallbackComponent={fallbackComponent}
          onChange={changeHandler}
          fileFetchTimeout={5000}
        />
      )}
    </>
  );
};

export default DiscoveryViewer;
