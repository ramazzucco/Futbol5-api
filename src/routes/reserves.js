const express = require('express');
const router = express.Router();
const reserves_controller = require('../controllers/reserves_controller');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

// READ
router.post('/', auth, reserves_controller.reserves);
router.post('/history', auth, reserves_controller.history);

// CREATE
router.post('/create', validate.reserve, reserves_controller.create);

// UPDATE
router.post('/checked', reserves_controller.checked);
router.post('/cancel', reserves_controller.cancel);

// DELETE
router.delete('/delete', auth, reserves_controller.delete); // On history
router.delete('/reset', auth, reserves_controller.reset); // On reserves

// Modify fields.
router.post('/fields', auth, reserves_controller.fields);

// Modify shedules.
router.post('/shedules', auth, reserves_controller.shedules);

// GET data charts.
router.post('/charts', auth, reserves_controller.charts);

module.exports = router;