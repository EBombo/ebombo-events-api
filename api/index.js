const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { getError } = require("./error/getError");
const { postError } = require("./error");
const { getManifest } = require("./manifest/get");
const { getResendVerifyCode, getCustomToken } = require("./users/get");
const { getVerifyCode } = require("./users/get");
const { validateRequest } = require("./validateRequest");
const { validateAuthUser } = require("./validateAuthUser");
const { deleteUser } = require("./users/delete");
const { putUpdateUser } = require("./users/put");
const { postUser, postUserByToken } = require("./users/post");
const { getGames } = require("./games/get");
const { businessEmail } = require("./contact/post");
const { postCompany } = require("./companies/post");
const { putCompany } = require("./companies/put");
const { version } = require("../config");
const { postCompanyMembers } = require("./companies/members/post");
const { putCompanyMembers } = require("./companies/members/put");
const { deleteMember } = require("./companies/members/delete");
const { postRelease } = require("./events/releases/post");
const { putRelease } = require("./events/releases/put");
const { postEvent } = require("./events/post");
const { putEvent } = require("./events/put");
const { postTemplate } = require("./templates/post");
const { putTemplate } = require("./templates/put");
const { updateSubscription } = require("./subscriptions/put");
const { reviewUpdateSubscription } = require("./subscriptions/review/post");

const api = express();
const router = express.Router();

router.use(cors({ origin: "*" }));

router.use(bodyParser.json());

router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", async (req, res) => res.send(`Hello dev ${version} ${process.env.NODE_ENV} ${process.env.PORT}`));

router.get("/tokens/:tokenId", getCustomToken);

router.post("/users/:userId", validateRequest, postUser);

router.put("/users/:userId/edit", validateRequest, putUpdateUser);

router.post("/companies/:companyId", validateRequest, postCompany);

router.put("/companies/:companyId", validateRequest, putCompany);

router.post("/companies/:companyId/members", validateRequest, postCompanyMembers);

router.delete("/companies/:companyId/members", validateRequest, deleteMember);

router.put("/companies/:companyId/members", validateRequest, putCompanyMembers);

router.delete("/users/:userId", validateRequest, deleteUser);

router.post("/tokens", postUserByToken);

router.get("/verify/:userId/verification-code/:verificationCode", getVerifyCode);

router.get("/verify/:userId/resend-code", getResendVerifyCode);

router.get("/manifest", getManifest);

router.get("/games/users/:userId", getGames);

router.post("/templates/:templateId", postTemplate);

router.put("/templates/:templateId", putTemplate);

router.post("/error-boundary", postError);

router.post("/contact", businessEmail);

router.get("/error-vanilla", getError);

router.post("/events/:eventId/releases/:releaseId", validateRequest, postRelease);

router.put("/events/:eventId/releases/:releaseId", validateRequest, putRelease);

router.post("/events", validateRequest, postEvent);

router.put("/events/:eventId", validateRequest, putEvent);

router.put("/subscriptions/:subscriptionId", validateAuthUser, updateSubscription);

router.post("/subscriptions/:subscriptionId/review", validateAuthUser, reviewUpdateSubscription);

api.use("/api", router);

module.exports = { api };
