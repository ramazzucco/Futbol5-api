const express = require('express');
const router = express.Router();
const controllers = require("../../controllers/reserveController");
const validationForm = require("../../middlewares/validatonForm");
const auth = require("../../middlewares/auth");

router.post('/', auth, controllers.getReserves);

router.post("/reset", auth, controllers.resetReserves);

router.post("/create", validationForm, controllers.create);

router.post('/canchaYhorario', auth, controllers.getCanchaYhorario);

router.post('/reservesoftheday', auth, controllers.reservesOfTheDay);

router.post("/sendhistorybyemail", auth, controllers.sendHistoryByEmail);

router.post('/reserve/:id', auth, controllers.getReserveById);


router.put('/modify', auth, controllers.modifyCanchayhorario);


router.delete("/delete/:id", auth, controllers.delete);

module.exports = router;