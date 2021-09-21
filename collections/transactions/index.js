const { snapshotToArray } = require("../../utils");
const { firestore } = require("../../config");

const fetchTransactionsByLobby = async (lobbyId) => {
  const transactions = await firestore
    .collection("transactions")
    .where("extra.id", "==", lobbyId)
    .get();

  return snapshotToArray(transactions);
};

const fetchTransactionsByUserAndAction = async (userId, action) => {
  const transactions = await firestore
    .collection("transactions")
    .where("user.id", "==", userId)
    .where("action", "==", action)
    .get();

  return snapshotToArray(transactions);
};

const fetchTransactionsByExtraId = async (extraId) => {
  const transactions = await firestore
    .collection("transactions")
    .where("extra.id", "==", extraId)
    .get();

  return snapshotToArray(transactions);
};

const fetchTransactionsByUserIdAndExtraId = async (userId, extraId) => {
  const transactions = await firestore
    .collection("transactions")
    .where("user.id", "==", userId)
    .where("extra.id", "==", extraId)
    .get();

  return snapshotToArray(transactions);
};

const fetchTransactionsByUserIdAndExtraIdAndAction = async (
  userId,
  extraId,
  action
) => {
  const transactions = await firestore
    .collection("transactions")
    .where("action", "==", action)
    .where("user.id", "==", userId)
    .where("extra.id", "==", extraId)
    .get();

  return snapshotToArray(transactions);
};

const deletedTransactions = async (transactions) => {
  const promises = transactions.map(
    async (transaction) =>
      await firestore.doc(`transactions/${transaction.id}`).delete()
  );

  await Promise.all(promises);
};

const fetchTransaction = async (transactionId) => {
  const withdrawalDoc = await firestore
    .collection("transactions")
    .doc(transactionId)
    .get();

  return withdrawalDoc.data();
};

module.exports = {
  fetchTransactionsByLobby,
  deletedTransactions,
  fetchTransaction,
  fetchTransactionsByExtraId,
  fetchTransactionsByUserIdAndExtraId,
  fetchTransactionsByUserIdAndExtraIdAndAction,
  fetchTransactionsByUserAndAction,
};
