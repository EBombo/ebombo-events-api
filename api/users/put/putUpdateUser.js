const logger = require("../../../utils/logger");
const { updateUser } = require("../../../collections/users");

const putUpdateUser = async (req, res, next) => {
  try {
    logger.log("user putUpdateUser->", req.body, req.params);

    const { userId } = req.params;
    const user = req.body;

    await updateUser(userId, {
      ...user,
      updateAt: new Date(),
    });

    return res.send(200);
  } catch (error) {
    next(error);
  }
};

module.exports = { putUpdateUser };
