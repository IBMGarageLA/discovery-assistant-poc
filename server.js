require("dotenv").config();
const express = require("express");
const server = express();

const fs = require("fs");

const cors = require("cors");
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const multer = require("multer");
const uploadHandler = multer({ dest: "/tmp/file" });

const DiscoveryV2 = require("ibm-watson/discovery/v2");
const { IamAuthenticator } = require("ibm-watson/auth");

const {
  WD_API_KEY,
  WD_API_VERSION,
  WD_SERVICE_URL,
  WD_PROJECT_ID,
  WD_COLLECTION_ID,
} = process.env;

const discoveryClient = new DiscoveryV2({
  authenticator: new IamAuthenticator({ apikey: WD_API_KEY }),
  version: WD_API_VERSION,
  serviceUrl: WD_SERVICE_URL,
});

const PORT = process.env.PORT || 3001;

server.post("/file/upload", uploadHandler.single("file"), (req, res) => {
  const { file, body } = req;

  const metadata = JSON.parse(body?.metadata);

  const fileStream = fs.readFileSync(file?.path);

  //DONE implement watson discovery upload process
  discoveryClient
    .addDocument({
      collectionId: WD_COLLECTION_ID,
      projectId: WD_PROJECT_ID,
      file: fileStream,
      filename: file?.originalname,
      fileContentType: file?.mimetype,
      metadata: metadata,
    })
    .then(({ result }) => {
      res.send({
        success: true,
        message: "File uploaded and processing started",
      });
    })
    .catch((e) => {
      console.error(e.message);
      res.send({
        success: false,
        message: "Error on file upload",
      });
    });
});

server.get("/search", (req, res) => {
  const { company, text } = req.query;

  discoveryClient
    .query({
      projectId: WD_PROJECT_ID,
      collectionIds: [WD_COLLECTION_ID],
      query: text,
      filter: `metadata.company::${company}`,
    })
    .then(({ result }) => {
      res.send(result);
    });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
