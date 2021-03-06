const { firestore, config } = require("../../../config");
const logger = require("../../../utils/logger");
const { fetchTemplates, fetchTemplate } = require("../../../collections/settings");
const { sendEmail } = require("../../../email/sendEmail");
const { updateEvent } = require("../../../collections/events");
const moment = require("moment");

const putEvent = async (req, res, next) => {
  try {
    logger.log("update event->", req.body);

    const event = req.body;
    const eventId = req.params.eventId;

    const members = event.members ?? [];

    const startDateFormatted = `${moment(event.currentDate.month).format("DD/MM/YYYY")} ${moment(
      event.currentDate.start
    ).format("h:mm a")}`;

    const endDateFormatted = `${moment(event.currentDate.month).format("DD/MM/YYYY")} ${moment(
      event.currentDate.end
    ).format("h:mm a")}`;

    const startAt = moment(startDateFormatted, "DD/MM/YYYY h:mm a").toDate();
    const endAt = moment(endDateFormatted, "DD/MM/YYYY h:mm a").toDate();

    delete event.currentDate;

    await updateEvent(eventId, { ...event, startAt, endAt, updateAt: new Date() });

    if (event.sendEmail) await sendEmailToMembers({ ...event, startAt, endAt, updateAt: new Date() }, members);

    return res.send({ success: true });
  } catch (error) {
    next(error);
  }
};

const sendEmailToMembers = async (event, members) => {
  try {
    const eventTemplate = await fetchTemplate("eventTemplate");

    const promisesEmails = members.map(async (member) => await sendEmailToUsers(member, event, eventTemplate));

    await Promise.all(promisesEmails);
  } catch (error) {
    logger.error(error);
  }
};

const sendEmailToUsers = async (user, event, template) =>
  await sendEmail(user.email.trim(), event.name, template, {
    startAt: moment(event.startAt.toDate()).format("DD/MM/YYYY h:mm a"),
    link: event.link,
    userEmail: user.email.trim(),
    imageUrl: event.imageUrl,
    eventName: event.name,
  });

module.exports = { putEvent };
