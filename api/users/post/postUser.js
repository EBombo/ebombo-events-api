const { firestore, config } = require("../../../config");
const logger = require("../../../utils/logger");
const { fetchSettings } = require("../../../collections/settings");
const { searchName } = require("../../../utils");
const { sendEmail } = require("../../../email/sendEmail");
const { get, defaultTo } = require("lodash");

const postUser = async (req, res, next) => {
  try {
    logger.log("user register->", req.body);

    const user = req.body;
    const origin = get(req, "headers.origin", config.serverUrl);

    user.id = req.params.userId;

    if (!user.email)
      return res.status(412).send({
        statusText: "invalid-email",
        message: "Email es requerido",
      });

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

    await sendMessage(user, verificationCode, origin);

    if (user.event) await registerEvent(user.event, user.id);

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
      },
      { merge: true }
    );
};

const sendMessage = async (user, verificationCode, origin) => {
  try {
    const templates = await fetchSettings("templates");
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

module.exports = { postUser };
