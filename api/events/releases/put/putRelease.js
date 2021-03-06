const logger = require("../../../../utils/logger");
const { fetchEventMembers } = require("../../../../collections/events/members");
const { updateRelease } = require("../../../../collections/events/releases");
const { fetchSettings } = require("../../../../collections/settings");
const { sendEmail } = require("../../../../email/sendEmail");
const { fetchEvent } = require("../../../../collections/events");

exports.putRelease = async (req, res, next) => {
  try {
    logger.log("putRelease->", req.params);

    const { eventId, releaseId } = req.params;
    const release = req.body;

    await updateRelease(eventId, releaseId, {
      ...release,
      updateAt: new Date(),
    });

    if (!release.sentEmail) return res.send({ success: true });

    const event = fetchEvent(eventId);
    const members = fetchEventMembers(eventId);

    await Promise.all([event, members]);

    logger.log("members->", members);

    await sentEmailToMembers(event, members, release);

    return res.send({ success: true });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const sentEmailToMembers = async (event, members, release) => {
  try {
    const templates = await fetchSettings("templates");
    const releaseTemplate = templates["releaseTemplate"];

    logger.log("releaseTemplase->", releaseTemplate);

    const emailsPromise = members.map(async (member) => {
      await sendEmail(member.email.trim(), release.subject, releaseTemplate.content, {
        content: release.content,
        imageUrl: release.imageUrl,
        link: event.link,
      });
    });

    await Promise.all(emailsPromise);
  } catch (error) {
    logger.error(error);
  }
};
