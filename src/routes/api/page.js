const express = require('express');
const router = express.Router();
const controllers = require("../../controllers/pageController");
const auth = require("../../middlewares/auth");


router.post("/", auth, controllers.getPage);

router.post("/modifycanchayhorario",auth, controllers.modifycanchayhorario);

router.post("/modifysection", auth, controllers.modifySection);

router.post("/modifyfooter", auth, controllers.modifyFooter);

router.post("/sponsors/:id", auth, controllers.getSponsors);

router.post("/modifyheader/link", auth, controllers.modifyLinks);

module.exports = router;
