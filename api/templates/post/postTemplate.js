const { firestore } = require("../../../config");
const { updateQuestions, updateTemplate } = require("../../../collections/templates");

exports.postTemplate = async (req, res, next) => {
  try {
    console.log("postTemplate", req.query, req.body, req.params);

    const game = req.body;

    const questions = game.questions;

    delete game.questions;

    const templateId = firestore.collection("templates").doc().id;

    await updateTemplate(templateId, {
      ...game,
      createAt: new Date(),
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
