const { firestore, config, adminFirestore } = require("../../../config");
const logger = require("../../../utils/logger");
const { fetchTemplates, updateSetting } = require("../../../collections/settings");
const { newCompanyId, newDefaultCompany, updateCompany } = require("../../../collections/companies");
const { updateUser } = require("../../../collections/users");
const { searchName } = require("../../../utils");
const { sendEmail } = require("../../../email/sendEmail");
const { get, defaultTo } = require("lodash");

const postUser = async (req, res, next) => {
  try {
    logger.log("user register->", req.body);

    const user = req.body;
    const origin = get(req, "headers.origin", config.serverUrl);

    user.id = req.params.userId;

    /** User email validation. **/
    if (!user.email)
      return res.status(412).send({
        statusText: "invalid-email",
        message: "Email es requerido",
      });

    /** User phoneNumber validation. **/
    const phoneNumber = get(user, "phoneNumber", null);
    const phoneNumberAlreadyExists =
      user.providerData.providerId === "password" ? await isPhoneNumberAlreadyExists(phoneNumber) : false;

    if (phoneNumberAlreadyExists)
      return res.status(412).send({
        statusText: "phone-number-already-exists",
        message: "Número telefónico ya esta registrado",
      });

    let verificationCode = Math.floor(1000 + Math.random() * 9000);
    let isVerified = user.providerData.providerId !== "password";

    await setUser(user, verificationCode, isVerified, origin);

    // TODO: Consider to move this into a function.
    const companyId = newCompanyId();
    const newCompany = {
      ...newDefaultCompany(),
      id: companyId,
      usersIds: [user.id],
    };

    await updateCompany(companyId, newCompany);

    // TODO: Consider create the company before the user, remember the write has a cost.
    await updateUser(user.id, {
      companyId,
      company: newCompany,
      updateAt: new Date(),
    });

    await sendMessage(user, verificationCode, origin);

    if (user.event) await registerEvent(user.event, user.id);

    /** Update analytics for Bdev. **/
    await updateSettingAnalytics(user);

    return res.send({ success: true });
  } catch (error) {
    next(error);
  }
};

const isPhoneNumberAlreadyExists = async (phoneNumber) => {
  if (!phoneNumber) return false;

  const userQuerySnapshot = await firestore.collection("users").where("phoneNumber", "==", phoneNumber).get();

  return !userQuerySnapshot.empty;
};

const setUser = async (user, verificationCode, isVerified, origin) => {
  const email = get(user, "email", "");
  const phoneNumber = get(user, "phoneNumber", null);

  await firestore
    .collection("users")
    .doc(user.id)
    .set(
      {
        id: user.id,
        birthDate: get(user, "birthDate", null),
        name: get(user, "name", null),
        lastName: get(user, "lastName", null),
        searchName: searchName({ ...user, phoneNumber, email }),
        email: defaultTo(email, "").toLowerCase(),
        providers: [get(user, "providerData.providerId", "")],
        dialCode: get(user, "dialCode", null),
        createAt: new Date(),
        updateAt: new Date(),
        phoneNumber: phoneNumber,
        countryCode: get(user, "countryCode", null),
        verificationCode,
        isVerified,
        origin,
        terms: true,
        theme: get(user, "theme", "darkTheme"),
        acls: user.acls || {},
        isBdev: get(user, "isBdev", false),
      },
      { merge: true }
    );
};

const sendMessage = async (user, verificationCode, origin) => {
  try {
    const templates = await fetchTemplates();
    const verifyCode = templates["verifyCode"];
    const newAccount = templates["newAccount"];

    if (user.providerData.providerId === "password")
      return await sendVerificationCodeEmail(user, verificationCode, origin, verifyCode);

    await sendWelcomeEmail(user, origin, newAccount);
  } catch (error) {
    logger.error(error);
  }
};

const sendVerificationCodeEmail = async (user, verificationCode, origin, template) =>
  await sendEmail(
    user.email.trim(),
    get(template, "subject", "Bienvenido a eBombo, porfavor confirma tu correo electrónico"),
    template.content,
    {
      userName: get(user, "name", ""),
      userEmail: user.email.trim(),
      verifyAccountLink: `${origin}/api/verify/${user.id}/verification-code/${verificationCode}`,
      code: verificationCode,
    }
  );

const sendWelcomeEmail = async (user, origin, template) =>
  await sendEmail(user.email.trim(), get(template, "subject", "Bienvenido"), template.content, {
    userName: get(user, "name", ""),
    userEmail: user.email.trim(),
  });

const registerEvent = async (event, userId) => {
  try {
    const eventRef = firestore.collection("events");

    const eventId = eventRef.doc().id;

    const datesFormatted = event.dates.map((date) => ({
      startAt: new Date(date.startAt),
      endAt: new Date(date.endAt),
    }));

    await eventRef.doc(eventId).set(
      {
        ...event,
        ...datesFormatted[0],
        dates: datesFormatted,
        userId,
        manageByUser: false,
        createAt: new Date(),
        updateAt: new Date(),
        deleted: false,
        id: eventId,
      },
      { merge: true }
    );
  } catch (error) {
    logger.error(error);
  }
};

const updateSettingAnalytics = async (user) => {
  let analytics = {
    totalUsers: adminFirestore.FieldValue.increment(1),
  };

  if (user.isBdev) {
    analytics.totalUsersBdev = adminFirestore.FieldValue.increment(1);
  }

  await firestore.collection("settings").doc("analytics").set(analytics, { merge: true });
};

module.exports = { postUser };
