const express = require("express");
const router = express.Router();
const validation = require("./validation");
const wikiController = require("../controllers/wikiController");
const helper = require("../auth/helpers");


router.get("/wikis", wikiController.index);
router.get("/wikis/:id", wikiController.view);

//KA - remember auth
// router.get("/wikis/:id/delete", helper.ensureAuthenticated, wikiController.delete);
// router.get("/wikis/:id/edit", helper.ensureAuthenticated, wikiController.edit);

router.get("/wikis/:id/delete", wikiController.delete);
router.get("/wikis/:id/edit", wikiController.edit);
router.post("/wikis/:id/update", wikiController.update);

module.exports = router;
