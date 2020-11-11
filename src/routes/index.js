const express = require('express');
const router = express.Router();
const controllers = require("../controllers/reserveController")

/* GET home page. */
router.get('/', controllers.getReserves);

router.post("/reserve", controllers.reserve);

router.delete("/delete/:id", controllers.delete);

module.exports = router;
