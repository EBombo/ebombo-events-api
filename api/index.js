const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { getSeo } = require("./seo/get");
const { getError } = require("./error/getError");
const { postError } = require("./error");
const { getManifest } = require("./manifest/get");
const { getResendVerifyCode, getCustomToken } = require("./users/get");
const { getVerifyCode } = require("./users/get");
const { validateRequest } = require("./validateRequest");
const { deleteUser } = require("./users/delete");
const { putUpdateUser } = require("./users/put");
const { postUser, postUserByToken } = require("./users/post");
const { getGames } = require("./games/get");
const { businessEmail } = require("./contact/post");

const api = express();
const router = express.Router();
const routerSeo = express.Router();

router.use(cors({ origin: "*" }));

router.use(bodyParser.json());

router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", async (req, res) => res.send("Hello!"));

router.get("/tokens/:tokenId", getCustomToken);

router.post("/users/:userId", validateRequest, postUser);

router.put("/users/:userId/edit", validateRequest, putUpdateUser);

router.delete("/users/:userId", validateRequest, deleteUser);

router.post("/tokens", postUserByToken);

router.get(
  "/verify/:userId/verification-code/:verificationCode",
  getVerifyCode
);

router.get("/verify/:userId/resend-code", getResendVerifyCode);

router.get("/manifest", getManifest);

router.get("/games/users/:userId", getGames);

router.post("/error-boundary", postError);

router.post("/contact", businessEmail);

router.get("/error-vanilla", getError);

api.use("/api", router);

routerSeo.all("*", getSeo);

api.use("/api/seo", routerSeo);

module.exports = { api };
