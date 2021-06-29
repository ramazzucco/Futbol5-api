const fs = require("fs");
const path = require("path");
const bcrypt = require('bcrypt');
const access_controller = require("../controllers/access_controller");
const pathdatadmin = path.join(__dirname,"../database/admins.json");

module.exports = async (req,res, next) => {

    console.log('desde auth: ',req.body.name)
    const admins = JSON.parse(fs.readFileSync(pathdatadmin, { encoding: 'utf-8' }));

    const userfind = admins.tokens.find( token => token.name === req.body.name );

    if(userfind && bcrypt.compareSync(userfind.token, req.body.token)){
        next();
    }else{
        res.json({
            meta: {
                status: 422
            },
            error: true,
            session: false,
            message: 'CSRF Token missing or expired'
        })
    }

}