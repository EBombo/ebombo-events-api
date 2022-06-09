const { firestore } = require("../../config");

const newCompanyId = () => firestore.collection("companies").doc().id;

const newDefaultCompany = () => ({
  id: companyId,
  createAt: new Date(),
  updateAt: new Date(),
  deleted: false,
  name: "",
  logoImgUrl: null,
  userIdentification: false, 
});

const fetchCompany = async (companyId) => {
  const companyQuerySnapShot = await firestore.doc(`companies/${companyId}`).get();

  return companyQuerySnapShot.exists ? companyQuerySnapShot.data() : null;
};

const updateCompany = async (companyId, company) =>
  await firestore.doc(`companies/${companyId}`).set(company, { merge: true });

module.exports = { fetchCompany, updateCompany, newCompanyId, newDefaultCompany };
