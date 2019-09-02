const express = require("express");
const router = express.Router();
const validation = require("./validation");
const userController = require("../controllers/userController");
const helper = require("../auth/helpers");


router.post("/users/signup", userController.signup);
router.get("/users/signup", userController.signup);
router.post("/users/create", validation.validateUsers, userController.create);

router.get("/users/signin", userController.signin);
router.post("/users/authenticate", validation.validateAuthentication, userController.authenticate);
router.get("/users/signout", userController.signout);

router.get("/users/profile", helper.ensureAuthenticated, userController.profile);


module.exports = router;

