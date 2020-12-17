const express = require('express');
const router = express.Router();
const controllers = require("../../controllers/reserveController")

router.get('/reserves', controllers.getReserves);

router.get("/reserves/admin", controllers.admin);

router.get("/reserves/history", controllers.sendReserveHistory);

router.post("/reserves/modify", controllers.modifyReserve);

router.post("/reserves/cancel", controllers.modifyReserve);

router.post("/reserves/send", controllers.reserve);

router.post('/reserves/:id', controllers.modifySingleReserve);

router.get('/reserves/canchaYhorario/:id', controllers.selectCanchaYhorario);

router.get('/reserves/canchaYhorario', controllers.getCanchaYhorario);

router.get('/reserves/reservesoftheday', controllers.reservesOfTheDay);

router.delete("/reserves/delete/:id", controllers.delete);

module.exports = router;