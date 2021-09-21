const { config } = require("../../../config");
const { sendEmail } = require("../../../email/sendEmail");
const { get } = require("lodash");
const logger = require("../../../utils/logger");
const { fetchSetting } = require("../../../collections/settings");
const { updateUser, fetchUser } = require("../../../collections/users");

const getVerifyCode = async (req, res, next) => {
  try {
    logger.log("getVerifyCode", req.params);

    const { userId, verificationCode } = req.params;

    const user = await fetchUser(userId);
    const origin = get(user, "origin", config.serverUrl);

    if (String(get(user, "verificationCode")) !== String(verificationCode))
      return res.redirect(`${origin}/500`);

    const promiseUser = updateUser(userId, { isVerified: true });
    const promiseEmail = sendEmail_(user, origin);

    await Promise.all([promiseUser, promiseEmail]);

    return res.redirect(origin);
  } catch (error) {
    next(error);
  }
};

const sendEmail_ = async (user, origin) => {
  const templates = await fetchSetting("templates");
  const newAccount = templates["newAccount"];

  await sendEmail(
    user.email,
    get(newAccount, "subject", "Bienvenido"),
    newAccount.content,
    {
      userName: get(user, "name", ""),
      userEmail: user.email,
      link: origin,
    }
  );
};

module.exports = { getVerifyCode };
