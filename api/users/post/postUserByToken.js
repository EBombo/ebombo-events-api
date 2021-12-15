const logger = require("../../../utils/logger");
const get = require("lodash/get");
const { auth } = require("../../../config");
const { fetchUser } = require("../../../collections/users");

exports.postUserByToken = async (req, res, next) => {
  try {
    logger.log("postUserByToken", req.body);

    const { tokenId, userId } = req.body;

    const authUser = tokenId ? await auth.verifyIdToken(tokenId) : {};

    const _user = await fetchUser(get(authUser, "uid", userId));

    return res.send({
      user: {
        name: _user.name,
        email: _user.email,
        uid: get(authUser, "uid", userId),
        companyId: get(_user, "companyId", null),
      },
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
