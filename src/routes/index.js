const express = require('express');
const router = express.Router();
const controllers = require("../controllers/indexController")

/* GET home page. */
router.get("/", controllers.index);

module.exports = router;
