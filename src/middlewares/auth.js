const bcrypt = require("bcrypt");
const urlBaseApi =
    process.env.USERDOMAIN == "DESKTOP-O3O462B"
        ? process.env.URL_API_DEV
        : process.env.URL_API_PROD;

module.exports = (req, res, next) => {
    const user = req.body.user ? req.body.user : req.body;

    const auth = bcrypt.compareSync(`${process.env.MY_PASS}`,user.key)

    auth ? next() : res.redirect(`${urlBaseApi}`);
};
