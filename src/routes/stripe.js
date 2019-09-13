const express = require("express");
const router = express.Router();
const validation = require("./validation");
const stripeController = require("../controllers/stripeController");
const helper = require("../auth/helpers");


router.get("/stripe/success", stripeController.success);
router.post("/users/downgrade", stripeController.downgrade);
// router.post("/webhook", stripeController.webhook);
router.get("/stripe/canceled", stripeController.canceled);

module.exports = router;
