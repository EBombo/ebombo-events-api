const { config, firestore, adminFirestore } = require("../../../config");
const { sendEmail } = require("../../../email/sendEmail");
const { fetchTemplates } = require("../../../collections/settings");

const businessEmail = async (req, res, next) => {
  try {
    const email = req.body.email;
    let message = req.body.message;
    const isBdev = req.body.isBdev;
    const phoneNumber = req.body.phoneNumber;
    let interests = "Servicios de interes: " + req.body.interests.join(",");

    const templates = await fetchTemplates();
    const templateBusiness = templates["business"];

    const promiseEmail = sendEmail_(config.mails, message + interests, phoneNumber, email, templateBusiness);

    /** Create document for contacts collection. **/
    const contactsRef = firestore.collection("contacts");
    const contactId = contactsRef.doc().id;
    const promiseFirebase = firestore.doc(`contacts/${contactId}`).set({
      id: contactId,
      email,
      isBdev,
      message,
      interests,
      phoneNumber,
      deleted: false,
      createAt: new Date(),
      updateAt: new Date(),
    });

    /** Update analytics for Bdev. **/
    const promiseSettings = updateSettingAnalytics(isBdev);

    await Promise.all([promiseEmail, promiseFirebase, promiseSettings]);

    return res.send(200);
  } catch (error) {
    next(error);
  }
};

const sendEmail_ = async (emails, message, companyPhone, companyEmail, template) =>
  await sendEmail(emails, "Contacto de empresa ebombo.com", template.content, {
    message,
    companyEmail,
    companyPhone,
  });

const updateSettingAnalytics = async (isBdev) => {
  let analytics = {
    totalContacts: adminFirestore.FieldValue.increment(1),
  };

  if (isBdev) {
    analytics.totalContactsBdev = adminFirestore.FieldValue.increment(1);
  }

  await firestore.collection("settings").doc("analytics").set(analytics, { merge: true });
};

module.exports = { businessEmail };
