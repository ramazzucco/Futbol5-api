const express = require('express');
const router = express.Router();
const indexcontroller = require('../controllers/access_controller');
const validator = require('../functions/validators');
const auth = require('../middlewares/auth');

// middlerware
const registerAuth = (req, res, next) => {
    const auth_key = process.env.AUTH_KEY;

    console.log('req.body.key: ',req.body.key,'auth_key: ',auth_key)
    if(req.body.key && req.body.key === auth_key){
        next();
    }else{
        return res.json({
            meta: {
                status: 400
            },
            error: true,
            data: [{
                param: 'key',
                msg: 'Invalid key'
            }]
        })
    }
}

// GET admins.
router.post('/admins', auth, indexcontroller.admins);

// Access.
router.post('/session', auth, indexcontroller.session);
router.post('/register', registerAuth, validator.register, indexcontroller.register);
router.post('/login', validator.login, indexcontroller.login);
router.post('/logout', auth, indexcontroller.logout);

module.exports = router;
