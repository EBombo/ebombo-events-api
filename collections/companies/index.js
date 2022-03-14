const { firestore } = require("../../config");

const fetchCompany = async (companyId) => {
  const companyQuerySnapShot = await firestore.doc(`companies/${companyId}`).get();

  return companyQuerySnapShot.exists ? companyQuerySnapShot.data() : null;
};

const updateCompany = async (companyId, company) =>
  await firestore.doc(`companies/${companyId}`).set(company, { merge: true });

module.exports = { fetchCompany, updateCompany };
