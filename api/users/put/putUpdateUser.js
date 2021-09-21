const logger = require("../../../utils/logger");
const { updateUser } = require("../../../collections/users");

const putUpdateUser = async (req, res, next) => {
  try {
    logger.log("user putUpdateUser->", req.body, req.params);

    const { userId } = req.params;
    const { phoneNumber, name, lastName } = req.body;

    await updateUser(userId, {
      name,
      lastName,
      phoneNumber,
    });

    return res.send(200);
  } catch (error) {
    next(error);
  }
};

module.exports = { putUpdateUser };
