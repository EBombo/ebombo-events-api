const { firestore } = require("../../../config");
const logger = require("../../../utils/logger");
const { fetchSetting } = require("../../../collections/settings");
const { config } = require("../../../config");
const { get, defaultTo } = require("lodash");

const postCompany = async (req, res, next) => {
  try {
    logger.log("company register->", req.body);

    const { companyId } = req.params;

    const company = req.body;

    await firestore.collection("companies").doc(companyId).set(company);

    return res.send({ success: true });
  } catch (error) {
    console.error("post company error->", error);
    next(error);
  }
};

module.exports = { postCompany };
