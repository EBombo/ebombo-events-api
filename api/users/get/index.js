const { getVerifyCode } = require("./getVerifyCode");
const { getResendVerifyCode } = require("./getResendVerifyCode");
const { getCustomToken } = require("./getCustomToken");

exports.getVerifyCode = getVerifyCode;
exports.getCustomToken = getCustomToken;
exports.getResendVerifyCode = getResendVerifyCode;
