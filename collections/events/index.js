const { firestore } = require("../../config");

const fetchEvent = async (eventId) => {
  const eventRef = await firestore.doc(`events/${eventId}`).get();

  return eventRef.exists ? eventRef.data() : null;
};

const updateEvent = async (eventId, event) => await firestore.doc(`events/${eventId}`).set(event, { merge: true });

module.exports = { fetchEvent, updateEvent };
