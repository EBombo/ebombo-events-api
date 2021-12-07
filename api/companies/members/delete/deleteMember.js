const { firestore } = require("../../../../config");
const {logger} = require("firebase-functions");

const deleteMember = async (req, res, next) => {
  try {
    const { companyId } = req.params;

    const { members } = req.body;

    const promises = members.map(async (member) => {
      await deleteMemberFromFirestore(member.id, companyId);
    });

    await Promise.all(promises);

    return res.send({ success: true });
  } catch (error) {
    logger.log("delete member error ->",error)
    next(error);
  }
};

const deleteMemberFromFirestore = async (memberId, companyId) =>
  await firestore
    .collection("companies")
    .doc(companyId)
    .collection("members")
    .doc(memberId)
    .delete();

module.exports = { deleteMember };
