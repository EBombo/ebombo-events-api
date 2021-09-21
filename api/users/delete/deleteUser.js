const { auth, firestore } = require("../../../config");

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    return;

    const deleteUserFromFirestorePromise = deleteUserFromFirestore(userId);
    const deleteUserFromAuthPromise = deleteUserFromAuth(userId);

    await Promise.all([
      deleteUserFromFirestorePromise,
      deleteUserFromAuthPromise,
    ]);

    return res.send(200);
  } catch (error) {
    next(error);
  }
};

const deleteUserFromFirestore = async (userId) =>
  await firestore.collection("users").doc(userId).delete();

const deleteUserFromAuth = async (userId) => await auth.deleteUser(userId);

module.exports = { deleteUser };
