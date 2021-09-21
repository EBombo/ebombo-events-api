const { config } = require("../../../config");
const { sendEmail } = require("../../../email/sendEmail");
const get = require("lodash/get");
const logger = require("../../../utils/logger");
const { fetchSetting } = require("../../../collections/settings");
const { fetchUser } = require("../../../collections/users");

const getResendVerifyCode = async (req, res, next) => {
  try {
    logger.log("resendVerifyCode", req.params);

    const userId = req.params.userId;

    const user = await fetchUser(userId);
    const origin = get(user, "origin", config.serverUrl);

    await sendEmail_(user, origin);

    return res.status(200).send("success");
  } catch (error) {
    next(error);
  }
};

const sendEmail_ = async (user, origin) => {
  const templates = await fetchSetting("templates");
  const verifyCode = templates["verifyCode"];

  await sendEmail(
    user.email,
    get(verifyCode, "subject", "Bienvenido, confirma tu correo electrónico"),
    verifyCode.content,
    {
      userName: get(user, "name", ""),
      userEmail: user.email,
      verifyAccountLink: `${origin}/api/verify/${user.id}/verification-code/${user.verificationCode}`,
      code: user.verificationCode,
    }
  );
};

module.exports = { getResendVerifyCode };
