const express = require('express');
const router = express.Router();
const controllers = require("../../controllers/pageController");
const auth = require("../../middlewares/auth");

router.post("/", auth, controllers.getPage);

router.post("/modifycanchayhorario", controllers.modifycanchayhorario);

module.exports = router;
