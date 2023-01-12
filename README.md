# 🔎 Watson Discovery Demo 🔎

- Customer: ADP
- Project: Watson Discovery Demo

## About the project

The application allows you to filter the Watson Discovery results based on metadatas. Below you may find the application diagram which describe how the componets connects.

![diagram](./support/diagrams/diagram.png)

The application compoenets were deployed on Code Engine in IBM Cloud it neccessary to specify the following environment variables.

- Watson Discovery APIKEY
- Watson Discovery version, which for this project was used `2020-08-30`
- Watson Discovery Service URL
- Watson Discovery Project ID
- Watson Discovery Collection ID
- AppID Client ID
- AppID Tenant ID
- AppID Secret
- AppID OAuth URL
- Cloudant APIKEY
- Cloudant Service URL
- Cloud Object Storage APIKEY
- Cloud Object Instance ID
- Cloud Object Storage Endpoint
- Cloud Object Storage Bucket

The components and service are all in IBM Cloud

To use the same collection for diferent companies it was used Discovery Metadata while ingesting documents, and it allow to query data over specific company.

it was used Natural Language Query to query data on Discovery Service.

### Built with

- [NodeJS](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [React](https://reactjs.org)
- [Watson Services](https://cloud.ibm.com/developer/watson/documentation)
- [Cloudant](https://cloud.ibm.com/catalog/services/cloudant)
- [AppId](https://cloud.ibm.com/catalog/services/app-id)
- [Carbon Components](https://react.carbondesignsystem.com/)

## Getting Started

### Prerequites

- [NodeJS](https://nodejs.org/)
- [NPM](https://www.npmjs.com/)

### Running Locally

1. Clone this repository

```sh
 git clone <repository_url>
```

2. Install packages

```sh
npm install
```

3. Create a .env file with the enviroment variables listed on [example.env](/dev-env-setup/example.env)

4. Run the application

```sh
npm run dev
```

### Deploy on Code Engine

0. Create the services on IBM Cloud

1. Clone this repository

```sh
 git clone <repository_url>
```

2. Create a deploy.env file with the enviroment variables listed on [deploy.env.example](./deploy.env.example)

3. Deploy on Code Engine

```sh
bash deploy.sh
```

## Folder Structure

```
.
├── dev-env-setup
│   └── example.env
├── support
│   └── diagram
│       └── diagram.png
├── public
│   ├── assets
│   │   └── pdf.worker.min.js
│   ├── favicon.ico
│   ├── ibm-watson.png
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── src
│   ├── assets
│   │   └── pdf.worker.min.js
│   ├── components
│   │   ├── DefaultHeader
│   │   │   └── index.js
│   │   ├── DiscoveryViewer
│   │   │   ├── DocumentProvider.js
│   │   │   ├── index.js
│   │   │   └── styles.scss
│   │   ├── PdfViewer
│   │   │   ├── index.js
│   │   │   └── styles.scss
│   │   ├── SearchResults
│   │   │   ├── index.js
│   │   │   └── styles.scss
│   │   ├── TestZone
│   │   │   ├── index.js
│   │   │   └── styles.scss
│   │   └── UploadZone
│   │       ├── index.js
│   │       └── styles.scss
│   ├── hooks
│   │   └── globalState.js
│   ├── pages
│   │   ├── Chat
│   │   │   └── index.js
│   │   ├── TestDiscovery
│   │   │   └── index.js
│   │   └── Upload
│   │       ├── index.js
│   │       └── styles.scss
│   ├── services
│   │   └── uploadFile.js
│   ├── App.js
│   ├── App.scss
│   ├── App.test.js
│   ├── index.js
│   ├── index.scss
│   ├── logo.svg
│   ├── reportWebVitals.js
│   ├── router.js
│   ├── setupTests.js
│   └── test3.pdf
├── Dockerfile
├── LICENSE
├── README.md
├── deploy.env.example
├── deploy.sh
├── package-lock.json
├── package.json
└── server.js

```

## License

Copyright 2022 IBM Client Engineering

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
