const logger = require("../../../../utils/logger");
const { firestore } = require("../../../../config");

const putCompanyMembers = async (req, res, next) => {
  try {
    logger.log("putCompany ->", req.params, !!req.body);

    const { companyId } = req.params;
    const { members, role, ads } = req.body;

    const promises = members.map(
      async (member) =>
        await firestore
          .collection("companies")
          .doc(companyId)
          .collection("members")
          .doc(member.id)
          .update({
            role,
            ads,
            updateAt: new Date(),
          })
    );

    await Promise.all([...promises]);

    return res.send({ success: true });
  } catch (error) {
    console.error("put members error->", error);
    next(error);
  }
};

module.exports = { putCompanyMembers };
