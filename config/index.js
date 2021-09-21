const admin = require("firebase-admin");
const configJson = require("./config");
const url = require("url");

const config =
  process.env.NODE_ENV === "production"
    ? configJson.production
    : configJson.development;

process.env.NODE_ENV === "production"
  ? admin.initializeApp()
  : admin.initializeApp(config.firebase);

const adminFirestore = admin.firestore;
const firestore = admin.firestore();
const auth = admin.auth();
const currentEnvironment = process.env.NODE_ENV;
const version = "0.0.1";

try {
  firestore.settings({ ignoreUndefinedProperties: true });
} catch (error) {
  console.error("ignoreUndefinedProperties", error);
}

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
