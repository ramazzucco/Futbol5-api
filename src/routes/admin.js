var express = require('express');
var router = express.Router();
const controllers = require("../controllers/adminController");

router.get("/", controllers.admin);

router.post("/login", controllers.login);

router.get("/logout", controllers.logout);

router.put("/password", controllers.updatePassword);

module.exports = router;
