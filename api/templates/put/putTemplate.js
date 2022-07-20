const { updateQuestions, updateTemplate } = require("../../../collections/templates");

exports.putTemplate = async (req, res, next) => {
  try {
    console.log("putTemplate", req.query, !!req.body, req.params);

    const game = req.body;
    const { templateId } = req.params;

    const questions = game.questions;

    delete game.questions;

    await updateTemplate(templateId, {
      ...game,
      updateAt: new Date(),
      deleted: false,
    });

    const questionsPromises = questions.map(async (question, index) => {
      await updateQuestions(templateId, question, index);
    });

    await Promise.all(questionsPromises);

    return res.send({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error?.message ?? "Something went wrong");
  }
};
