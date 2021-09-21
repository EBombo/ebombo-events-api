const admin = require("firebase-admin");
const url = require("url");
const configJson = require("./config");

admin.initializeApp();

const adminFirestore = admin.firestore;
const firestore = admin.firestore();
const auth = admin.auth();
const projectId = process.env.GCLOUD_PROJECT;
const currentEnvironment = projectId.includes("-dev") ? "dev" : "production";

try {
  firestore.settings({ ignoreUndefinedProperties: true });
} catch (error) {
  console.error("ignoreUndefinedProperties", error);
}

const config = projectId.includes("-dev")
  ? configJson.development
  : configJson.production;

const hostname = (req) => url.parse(req.headers.origin).hostname;

module.exports = {
  adminFirestore,
  currentEnvironment,
  firestore,
  hostname,
  auth,
  config,
};
