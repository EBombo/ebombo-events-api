const logger = require("../../../utils/logger");
const { updateUser } = require("../../../collections/users");
const { updateCompany } = require("../../../collections/companies");
const get = require("lodash/get");

const putCompany = async (req, res, next) => {
  try {
    logger.log("putCompany ->", req.params, !!req.body);

    const { companyId } = req.params;
    const company = req.body;

    const companyPromise = updateCompany(companyId, {
      ...company,
      updateAt: new Date(),
      deleted: false,
    });

    const promises = get(company, "usersIds", []).map(
      async (userId) =>
        await updateUser(userId, {
          companyId,
          company: { ...company, id: companyId },
          updateAt: new Date(),
        })
    );

    await Promise.all([...promises, companyPromise]);

    return res.send({ success: true });
  } catch (error) {
    console.error("put company error->", error);
    next(error);
  }
};

module.exports = { putCompany };
