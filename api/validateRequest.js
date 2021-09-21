const { validationResult } = require("express-validator");

const validateRequest = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).send(errors.array());
    return;
  }

  next();
};

module.exports = { validateRequest };
