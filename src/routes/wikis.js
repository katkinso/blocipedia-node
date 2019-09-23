const express = require("express");
const router = express.Router();
const validation = require("./validation");
const wikiController = require("../controllers/wikiController");
const helper = require("../auth/helpers");


router.get("/wikis/new", helper.ensureAuthenticated, wikiController.new);
router.post("/wikis/create", helper.ensureAuthenticated, wikiController.create);

router.get("/wikis", wikiController.index);
router.get("/wikis/:id", wikiController.view);

router.get("/wikis/:id/delete", helper.ensureAuthenticated, wikiController.delete);

router.get("/wikis/:id/edit", helper.ensureAuthenticated, wikiController.edit);

router.post("/wikis/:id/update", helper.ensureAuthenticated, wikiController.update);


module.exports = router;
