const { firestore } = require("../../config");

/** TODO: Lo necesario para las transacciones de los templates [templates, trivia, bingo, ruleta]. **/

/** Trivia **/
const updateQuestions = async (templateId, question, index) =>
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

/** TODO: Bingo **/
/** TODO: Roulette **/

/** Common **/
const updateTemplate = async (templateId, template) =>
  await firestore.collection("templates").doc(templateId).set(template, { merge: true });

module.exports = { updateQuestions, updateTemplate };
