require("dotenv").config();

const express = require("express");
const server = express();
const session = require("express-session");
const passport = require("passport");
const WebAppStrategy = require("ibmcloud-appid").WebAppStrategy;
const cors = require("cors");
const IBM = require("ibm-cos-sdk");
const fs = require("fs");

const {
  WD_API_KEY,
  WD_API_VERSION,
  WD_SERVICE_URL,
  WD_PROJECT_ID,
  WD_COLLECTION_ID,
  APPID_CLIENT_ID,
  APPID_TENANT_ID,
  APPID_SECRET,
  APPID_OAUTH_URL,
  APP_DOMAIN,
  CLOUDANT_API_KEY,
  CLOUDANT_SERVICE_URL,
  COS_API_KEY,
  COS_INSTANCE_ID,
  COS_ENDPOINT,
  COS_BUCKET,
} = process.env;

const config = {
  endpoint: COS_ENDPOINT,
  apiKeyId: COS_API_KEY,
  serviceInstanceId: COS_INSTANCE_ID,
  signatureVersion: "iam",
};

const cos = new IBM.S3(config);

server.use(
  session({
    secret: "123456",
    resave: true,
    saveUninitialized: true,
  })
);
server.use(passport.initialize());
server.use(passport.session());
passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((user, cb) => cb(null, user));
passport.use(
  new WebAppStrategy({
    tenantId: APPID_TENANT_ID,
    clientId: APPID_CLIENT_ID,
    secret: APPID_SECRET,
    oauthServerUrl: APPID_OAUTH_URL,
    redirectUri: `${APP_DOMAIN}/appid/callback`,
  })
);

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const multer = require("multer");
const uploadHandler = multer({ dest: "/tmp/file" });

const DiscoveryV2 = require("ibm-watson/discovery/v2");
const { IamAuthenticator } = require("ibm-watson/auth");
const path = require("path");
const { CloudantV1 } = require("@ibm-cloud/cloudant");

const discoveryClient = new DiscoveryV2({
  authenticator: new IamAuthenticator({ apikey: WD_API_KEY }),
  version: WD_API_VERSION,
  serviceUrl: WD_SERVICE_URL,
});

const cloudantClient = new CloudantV1({
  authenticator: new IamAuthenticator({ apikey: CLOUDANT_API_KEY }),
  serviceUrl: CLOUDANT_SERVICE_URL,
});

const PORT = process.env.BACKEND_PORT || 3001;

const uploadCos = (file) => {
  // console.log(file);
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: COS_BUCKET,
      Key: file.filename,
      Body: file?.data,
      ContentType: file?.mimetype,
    };

    cos
      .putObject(params)
      .promise()
      .then((d) => {
        resolve(file);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

const addDsicovery = (file) => {
  return new Promise((resolve, reject) => {
    discoveryClient
      .addDocument({
        collectionId: WD_COLLECTION_ID,
        projectId: WD_PROJECT_ID,
        file: file?.fileStream,
        filename: file?.originalname,
        fileContentType: file?.mimetype,
        metadata: file?.metadata,
      })
      .then(({ result }) => {
        resolve(result);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

server.get(
  "/appid/callback",
  passport.authenticate(WebAppStrategy.STRATEGY_NAME)
);

if (process.env.NODE_ENV === "production") {
  server.use(passport.authenticate(WebAppStrategy.STRATEGY_NAME));
}

server.use(express.static(path.join(__dirname, "build")));

server.post("/file/upload", uploadHandler.single("file"), (req, res) => {
  const { file, body } = req;

  const metadata = JSON.parse(body?.metadata);

  const fileStream = fs.readFileSync(file?.path);

  return Promise.resolve({
    data: fileStream,
    filename: file.originalname,
    mimetype: file.mimetype,
    metadata: metadata,
  })
    .then(uploadCos)
    .then(addDsicovery)
    .then(() => {
      res.send({
        success: true,
        message: "File uploaded and processing started",
      });
    })
    .catch((e) => {
      console.log(e.message);
      res.send({
        success: false,
        message: "Error on file upload",
      });
    });

  //DONE implement watson discovery upload process
  // discoveryClient
  //   .addDocument({
  //     collectionId: WD_COLLECTION_ID,
  //     projectId: WD_PROJECT_ID,
  //     file: fileStream,
  //     filename: file?.originalname,
  //     fileContentType: file?.mimetype,
  //     metadata: metadata,
  //   })
  //   .then(({ result }) => {
  //     res.send({
  //       success: true,
  //       message: "File uploaded and processing started",
  //     });
  //   })
  //   .catch((e) => {
  //     console.error(e.message);
  //     res.send({
  //       success: false,
  //       message: "Error on file upload",
  //     });
  //   });
});

server.get("/search", (req, res) => {
  const { company, text } = req.query;

  discoveryClient
    .query({
      projectId: WD_PROJECT_ID,
      collectionIds: [WD_COLLECTION_ID],
      naturalLanguageQuery: text,
      passages: {
        enabled: "true",
        fields: ["text"],
        characters: 325,
        per_document: true,
        max_per_document: 10,
        find_answers: true,
        max_answers_per_passage: 1,
      },
      filter: `metadata.company::${company}`,
    })
    .then(({ result }) => {
      res.send(result);
    });
});

server.post("/feedback", (req, res) => {
  const dbName = "user-feedbacks";
  const doc = req.body;

  cloudantClient
    .postDocument({ db: dbName, document: doc })
    .then(({ result }) => {
      res.send(result);
    })
    .catch((error) => {
      console.error(JSON.stringify(error, null, 4));
      res.status(500).send(error.message);
    });
});

server.put("/feedback/:id", (req, res) => {
  const dbName = "user-feedbacks";
  const { id } = req.params;
  const doc = req.body;

  cloudantClient
    .putDocument({ db: dbName, docId: id, document: doc })
    .then(({ result }) => {
      res.send(result);
    })
    .catch((error) => {
      console.error(JSON.stringify(error, null, 4));
      res.status(500).send(error.message);
    });
});

server.get("/user", (req, res) => {
  res.send(req.user);
});

server.get("/pdf", async (req, res) => {
  const { key } = req.query;
  const document = await cos
    .getObject({
      Bucket: "hr-documents",
      Key: key,
    })
    .promise();

  res.send(document);
});

server.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
