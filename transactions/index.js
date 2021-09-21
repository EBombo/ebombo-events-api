const { firestore } = require("../config");

exports.transaction = async (
  user,
  payment,
  amount,
  description,
  action,
  extra,
  note = null,
  extra2 = null
) => {
  const transactionRef = await firestore.collection("transactions");
  const transactionId = await transactionRef.doc().id;
  const transaction = documentTransaction(
    transactionId,
    user,
    payment,
    amount,
    description,
    action,
    note
  );

  if (extra)
    if (action === "withdraw") transaction.accountNumber = extra;
    else transaction.extra = extra;

  if (extra2) transaction.extra2 = extra2;

  await transactionRef.doc(transactionId).set(transaction);

  return transactionId;
};

const documentTransaction = (
  transactionId,
  user,
  payment,
  amount,
  description,
  action,
  note
) => ({
  id: transactionId,
  user: user,
  payment: +payment,
  amount: +amount,
  description: description,
  action: action,
  note: note,
  createAt: new Date(),
});
