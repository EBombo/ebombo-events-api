const { auth } = require("../config");
const logger = require("../utils/logger");

const validateAuthUser = async (req, res, next) => {
  try {
    logger.log("req.headers.authorization", req.headers.authorization);

    const tokenId = req.headers.authorization.split("Bearer ")[1];

    logger.log("tokenId", tokenId);

    const authUser = await auth.verifyIdToken(tokenId);

    logger.log("userId", authUser.uid);

    next();
  } catch (error) {
    return res.status(400).send({error: "access denied"});
  }
};

module.exports = { validateAuthUser };
