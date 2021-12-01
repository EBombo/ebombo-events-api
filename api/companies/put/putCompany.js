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

    res.send({ success: true });
  } catch (error) {
    console.error("put company error->", error);
    next(error);
  }
};

module.exports = { putCompany };
