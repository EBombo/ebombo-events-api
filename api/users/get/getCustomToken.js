const logger = require("../../../utils/logger");
const { auth } = require("../../../config");

exports.getCustomToken = async (req, res, next) => {
  try {
    logger.log("getCustomToken", req.params);

    const { tokenId } = req.params;

    const customToken = await auth.createCustomToken(tokenId);

    return res.send({ token: customToken });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
