const { fetchUser } = require("../collections/users");
const { auth } = require("../config");
const logger = require("../utils/logger");

const validateAdmin = async (req, res, next) => {
  try {
    logger.log("req.headers.authorization", req.headers.authorization);

    const tokenId = req.headers.authorization.split("Bearer ")[1];

    logger.log("tokenId", tokenId);

    const authUser = await auth.verifyIdToken(tokenId);

    const user = await fetchUser(authUser.uid);

    logger.log("user", !!user);

    if (!user.isAdmin) return res.status(400).send("access denied");

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { validateAdmin };
