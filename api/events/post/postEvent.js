const { firestore, config } = require("../../../config");
const logger = require("../../../utils/logger");
const { fetchTemplates } = require("../../../collections/settings");
const { sendEmail } = require("../../../email/sendEmail");
const { updateEvent } = require("../../../collections/events");
const moment = require("moment");

const postEvent = async (req, res, next) => {
  try {
    logger.log("create event->", req.body);

    const event = req.body;
    const eventId = req.params.userId;

    const members = event.members ?? [];

    const startDateFormatted = `${event.currentDate.month.format("DD/MM/YYYY")} ${event.currentDate.start.format(
      "h:mm a"
    )}`;

    const endDateFormatted = `${event.currentDate.month.format("DD/MM/YYYY")} ${event.currentDate.end.format(
      "h:mm a"
    )}`;

    const startAt = moment(startDateFormatted, "DD/MM/YYYY h:mm a").toDate();
    const endAt = moment(endDateFormatted, "DD/MM/YYYY h:mm a").toDate();

    await updateEvent(eventId, { ...event, startAt, endAt, createAt: new Date(), updateAt: new Date() });

    if (event.sendEmail)
      await sendEmailToMembers({ ...event, startAt, endAt, createAt: new Date(), updateAt: new Date() }, members);

    return res.send({ success: true });
  } catch (error) {
    next(error);
  }
};

const sendEmailToMembers = async (event, members) => {
  try {
    const templates = await fetchTemplates();
    const eventTemplate = templates["eventTemplate"];

    const promisesEmails = members.map(async (member) => await sendEmailToUsers(member, event, eventTemplate));

    await Promise.all(promisesEmails);
  } catch (error) {
    logger.error(error);
  }
};

const sendEmailToUsers = async (user, event, template) =>
  await sendEmail(user.email.trim(), event.name, template.content, {
    startAt: event.startAt,
    endAt: event.endAt,
    userEmail: user.email.trim(),
  });

module.exports = { postEvent };
