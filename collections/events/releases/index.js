const { firestore } = require("../../config");

const fetchRelease = async (eventId, releaseId) => {
  const releaseRef = await firestore.doc(`events/${eventId}/releases/${releaseId}`).get();

  return releaseRef.exists ? releaseRef.data() : null;
};

const updateRelease = async (eventId, releaseId, release) =>
  await firestore.doc(`events/${eventId}/releases/${releaseId}`).set(release, { merge: true });

module.exports = { updateRelease, fetchRelease };
