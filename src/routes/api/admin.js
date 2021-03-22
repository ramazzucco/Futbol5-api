const express = require('express');
const router = express.Router();
const controllers = require("../../controllers/adminController");
const validationFormUsers = require("../../middlewares/validationFormUsers");

router.post("/create",validationFormUsers, controllers.create);

router.post("/login", controllers.login);

// router.post("/logout", controllers.logout);

router.put("/changepassword", controllers.updatePassword);

module.exports = router;
