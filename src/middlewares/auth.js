const bcrypt = require("bcrypt");
const urlBaseApi =
    process.env.USERDOMAIN == "DESKTOP-O3O462B"
        ? process.env.URL_API_DEV
        : process.env.URL_API_PROD;
const functions = require("../functions/admin");


module.exports = async (req, res, next) => {

    const user = req.body.user ? req.body.user : req.body;

    const session = functions.getSession(user);

    const auth = bcrypt.compareSync(`${process.env.MY_PASS}`,user.token)

    auth ? next() : res.redirect(`${urlBaseApi}`);
};
