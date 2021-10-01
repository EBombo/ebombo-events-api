const logger = require("../../../utils/logger");
const { auth } = require("../../../config");
const { fetchUser } = require("../../../collections/users");

exports.postUserByToken = async (req, res, next) => {
  try {
    logger.log("postUserByToken", req.body);

    const { tokenId } = req.body;

    const authUser = await auth.verifyIdToken(tokenId);

    const _user = fetchUser(authUser.uid);

    return res.send({
      user: {
        name: _user.name,
        email: _user.email,
        uid: authUser.uid,
      },
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
