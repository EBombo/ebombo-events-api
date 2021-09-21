const { firestore } = require("../../config");
const logger = require("../../utils/logger");

const fetchUsers = async () => {
  return null;
};

const fetchUser = async (userId) => {
  const userQuerySnapShot = await firestore.doc(`users/${userId}`).get();
  return userQuerySnapShot.exists ? userQuerySnapShot.data() : null;
};

const updateUser = async (userId, user) => {
  let user_ = await fetchUser(userId);
  logger.log("before change ", userId, user_.money);

  await firestore.doc(`users/${userId}`).update(user);

  user_ = await fetchUser(userId);
  logger.log("after change ", userId, user_.money);
};

module.exports = { fetchUsers, fetchUser, updateUser };
