const get = require("lodash/get");
const logger = require("../../../utils/logger");
const { updateCompany } = require("../../../collections/companies");
const { updateUser } = require("../../../collections/users");

const postCompany = async (req, res, next) => {
  try {
    logger.log("postCompany ->", req.params, !!req.body);

    const { companyId } = req.params;

    const company = req.body;

    const newCompany = {
      ...company,
      id: companyId,
      createAt: new Date(),
      updateAt: new Date(),
      deleted: false,
    };

    const companyPromise = updateCompany(companyId, newCompany);

    const promises = get(company, "usersIds", []).map(
      async (userId) =>
        await updateUser(userId, {
          companyId,
          company: newCompany,
          updateAt: new Date(),
        })
    );

    await Promise.all([...promises, companyPromise]);

    return res.send({ success: true });
  } catch (error) {
    console.error("post company error->", error);
    next(error);
  }
};

module.exports = { postCompany };
