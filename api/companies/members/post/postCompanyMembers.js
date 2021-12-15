const logger = require("../../../../utils/logger");
const { firestore } = require("../../../../config");

const postCompanyMembers = async (req, res, next) => {
  try {
    logger.log("postCompanyMembers ->", req.params, !!req.body);

    const { companyId } = req.params;

    const { members: membersEmails, role, ads } = req.body;

    const promises = membersEmails.map(async (memberEmail) => {
      // Prevent create empty member.
      if (!memberEmail) return;

      const membersRef = await firestore
        .collection("companies")
        .doc(companyId)
        .collection("members");
      const memberId = await membersRef.doc().id;

      await membersRef.doc(memberId).set({
        id: memberId,
        key: memberId,
        email: memberEmail,
        role,
        ads,
        searchName: [memberEmail.toUpperCase()],
        status: "Active",
        createAt: new Date(),
        updateAt: new Date(),
        delete: false,
      });
    });

    await Promise.all(promises);

    return res.send({ success: true });
  } catch (error) {
    console.error("post members error->", error);
    next(error);
  }
};

module.exports = { postCompanyMembers };
