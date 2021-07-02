const express = require('express');
const router = express.Router();
const finance_controller = require('../controllers/finance_controller');
const auth = require('../middlewares/auth');

router.post('/', auth, finance_controller.finance);

module.exports = router;
