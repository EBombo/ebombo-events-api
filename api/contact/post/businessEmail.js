const { config } = require("../../../config");
const { sendEmail } = require("../../../email/sendEmail");
const { fetchTemplates } = require("../../../collections/settings");

const businessEmail = async (req, res, next) => {
  try {
    const message = req.body.message;
    const phoneNumber = req.body.phoneNumber;
    const email = req.body.email;

    const templates = await fetchTemplates();
    const templateBusiness = templates["business"];

    await sendEmail_(
      config.mails,
      message,
      phoneNumber,
      email,
      templateBusiness
    );

    return res.send(200);
  } catch (error) {
    console.error("Post message chat", error);
    next(error);
  }
};

const sendEmail_ = async (
  emails,
  message,
  companyPhone,
  companyEmail,
  template
) =>
  await sendEmail(emails, "Contacto de empresa ebombo.com", template.content, {
    message,
    companyEmail,
    companyPhone,
  });

module.exports = { businessEmail };
