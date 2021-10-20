const logger = require("../../../utils/logger");
const { auth } = require("../../../config");
const { fetchUser } = require("../../../collections/users");

exports.postUserByToken = async (req, res, next) => {
  try {
    logger.log("postUserByToken", req.body);
    console.log("postUserByToken", req.body);

    let { tokenId, userId } = req.body;

    if (!tokenId && !userId) throw Error("token o userId is required!");

    if (tokenId) {
      const authUser = await auth.verifyIdToken(tokenId);
      userId = authUser.uid;
    }

    const _user = await fetchUser(userId);

    return res.send({
      user: {
        name: _user.name,
        email: _user.email,
        uid: userId,
      },
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
