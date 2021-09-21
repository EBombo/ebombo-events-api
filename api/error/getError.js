const { firestore } = require("../../config");
const logger = require("../../utils/logger");
const defaultTo = require("lodash/defaultTo");

const getError = async (req, res, next) => {
  try {
    logger.log("error from vanilla", req.query);

    const { url, type, time, message, file, line } = req.query;

    await saveError({
      url: defaultTo(url, null),
      type: defaultTo(type, null),
      time: defaultTo(time, null),
      message: defaultTo(message, null),
      file: defaultTo(file, null),
      line: defaultTo(line, null),
    });

    return res.send(200);
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const saveError = async (errors) => {
  const errorId = firestore.collection("errors").doc().id;
  await firestore
    .collection("errors")
    .doc(errorId)
    .set({
      id: errorId,
      ...errors,
      vanilla: true,
      createAt: new Date(),
      updateAt: new Date(),
      delete: false,
    });
};

module.exports = { getError };
