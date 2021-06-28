const fs = require("fs");
const path = require("path");
const bcrypt = require('bcrypt');
const access_controller = require("../controllers/access_controller");
const pathdatadmin = path.join(__dirname,"../database/admins.json");

module.exports = async (req,res, next) => {

    const admins = JSON.parse(fs.readFileSync(pathdatadmin, { encoding: 'utf-8' }));

    admins.tokens.map( token => {

        if(token.name === req.body.name && bcrypt.compareSync(token.token, req.body.token)){
            next();
        }else{
            return res.json({
                met: {
                    status: 422
                },
                error: true,
                session: false,
                message: 'CSRF Token missing or expired'
            })
        }

    })

}