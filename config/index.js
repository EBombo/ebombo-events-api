require('dotenv').config();

const admin = require("firebase-admin");
const configJson = require("./config");
const url = require("url");
const serviceAccountEventsDev = require("./ebombo-events-dev-firebase-adminsdk-brntw-ad09602471.json");

console.log("process.env.NODE_ENV", process.env.NODE_ENV);

const CONFIG = process.env.SERVER_CONFIG ?? "";
// console.log("process.env.SERVER_CONFIG", CONFIG);

const config = JSON.parse(CONFIG);

const stripe = require('stripe')(config.stripeApiKey);

process.env.NODE_ENV === "production"
  ? admin.initializeApp()
  : admin.initializeApp({
      credential: admin.credential.cert(serviceAccountEventsDev),
      databaseURL: config.firebase.databaseURL,
    });

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
  stripe,
};
