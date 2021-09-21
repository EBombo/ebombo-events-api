const logger = require("../../../utils/logger");
const defaultTo = require("lodash/defaultTo");
const get = require("lodash/get");
const { firestore, config } = require("../../../config");

exports.getManifest = async (req, res, next) => {
  try {
    logger.log(
      "getManifest->",
      req.headers["x-forwarded-host"],
      req.hostname,
      req.host
    );

    let domain = req.headers["x-forwarded-host"] || req.hostname || req.host;

    const manifestRef = await firestore.doc(`settings/manifest`).get();

    let manifest = manifestRef.data();

    domain = domain.replace(".", "&").replace(".", "&");

    manifest = get(manifest, domain);

    manifest &&
      res.set("Cache-Control", `public, max-age=${config.maxAgeCache}`);
    res.set("Content-Type", "application/json");

    return res.send({ ...defaultTo(manifest, {}) });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
