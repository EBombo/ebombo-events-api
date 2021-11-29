const logger = require("../../../utils/logger");
const { updateUser } = require("../../../collections/users");

const putCompany = async (req, res, next) => {
  try {
    logger.log("company putCompany->", req.body, req.params);

    const { companyId } = req.params;
    const company = req.body;

    await updateUser(companyId, {
      ...company,
      updateAt: new Date(),
    });

    return res.send(200);
  } catch (error) {
    next(error);
  }
};

module.exports = { putCompany };
