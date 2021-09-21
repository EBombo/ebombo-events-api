const logger = require("../../../utils/logger");
const { auth } = require("../../../config");

exports.postUserByToken = async (req, res, next) => {
  try {
    logger.log("postUserByToken", req.body);

    const { tokenId } = req.body;

    const authUser = await auth.verifyIdToken(tokenId);

    return res.send({ user: authUser });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
