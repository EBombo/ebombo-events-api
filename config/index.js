const admin = require("firebase-admin");
const url = require("url");
const configJson = require("./config");

admin.initializeApp();

const adminFirestore = admin.firestore;
const firestore = admin.firestore();
const auth = admin.auth();
const projectId = process.env.GCLOUD_PROJECT;
const currentEnvironment = "production";
const version = "0.0.1";

try {
  firestore.settings({ ignoreUndefinedProperties: true });
} catch (error) {
  console.error("ignoreUndefinedProperties", error);
}

const config = configJson.development ?? configJson.production;

const hostname = (req) => url.parse(req.headers.origin).hostname;

module.exports = {
  adminFirestore,
  currentEnvironment,
  firestore,
  hostname,
  auth,
  config,
  version,
};
