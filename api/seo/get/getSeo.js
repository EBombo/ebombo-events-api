const { firestore, config } = require("../../../config");
const logger = require("../../../utils/logger");
const get = require("lodash/get");
const isEmpty = require("lodash/isEmpty");

exports.getSeo = async (req, res, next) => {
  try {
    logger.log(
      "getSeo",
      req.headers["x-forwarded-host"] || req.hostname || req.host
    );

    let domain = req.headers["x-forwarded-host"] || req.hostname || req.host;
    const path = get(req, "path");

    if (!domain) return res.send({});

    logger.log("-->", domain, path);

    const seoQuery = await firestore.collection("seo").doc(domain).get();

    const seo = seoQuery.data();

    !isEmpty(seo) &&
      res.set("Cache-Control", `public, max-age=${config.maxAgeCache}`);

    return res.send(seo || {});
  } catch (error) {
    logger.log(error);
    next(error);
  }
};
