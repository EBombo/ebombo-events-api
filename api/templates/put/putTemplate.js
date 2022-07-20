const { firestore } = require("../../../config");

exports.putTemplate = async (req, res, next) => {
  try {
    console.log("putTemplate", req.query, !!req.body, req.params);

    const game = req.body;
    const { templateId } = req.params;

    const questions = game.questions;

    delete game.questions;

    await firestore
      .collection("templates")
      .doc(templateId)
      .set(
        {
          ...game,
          updateAt: new Date(),
          deleted: false,
        },
        { merge: true }
      );

    const questionsPromises = questions.map(async (question, index) => {
      await firestore
        .collection("templates")
        .doc(templateId)
        .collection("questions")
        .doc(question.id)
        .set({
          ...question,
          questionNumber: index + 1,
          createAt: new Date(),
          updateAt: new Date(),
          deleted: false,
        });
    });

    await Promise.all(questionsPromises);

    return res.send({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error?.message ?? "Something went wrong");
  }
};
