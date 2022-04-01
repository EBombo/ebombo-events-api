const { firestore } = require("../../../../config");
const { snapshotToArray } = require("../../../../utils");

const fetchEventMembers = async (eventId) => {
  const membersRef = await firestore
    .collection("events")
    .doc(eventId)
    .collection("members")
    .where("deleted", "==", false)
    .get();

  return snapshotToArray(membersRef);
};

module.exports = { fetchEventMembers };