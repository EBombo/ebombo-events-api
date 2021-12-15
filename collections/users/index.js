const { firestore } = require("../../config");

const fetchUser = async (userId) => {
  const userQuerySnapShot = await firestore.doc(`users/${userId}`).get();
  return userQuerySnapShot.exists ? userQuerySnapShot.data() : null;
};

const updateUser = async (userId, user) =>
  await firestore.doc(`users/${userId}`).update(user);

module.exports = { fetchUser, updateUser };
