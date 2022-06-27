const { firestore } = require("../../config");

const fetchSettings = async () => {
  const settings = await firestore.doc("settings/default").get();
  return settings.data();
};

const updateSetting = async (settingId, setting) => await firestore.doc(`settings/${settingId}`).update(setting);

const fetchTemplates = async () => {
  const templates_ = await firestore.doc("settings/templates").get();
  return templates_.data();
};

const fetchTemplate = async (templateName) => {
  const templates_ = await firestore.doc("settings/templates").get();
  const templateData = templates_.data();

  if (templateData) return templateData[templateName].content;
};


module.exports = { fetchSettings, updateSetting, fetchTemplates, fetchTemplate };
