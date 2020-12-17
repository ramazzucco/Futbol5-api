let db = require("../database/models");
const functions = require("../functions/admin");
const bcrypt = require("bcrypt");
const urlBaseAppProd = functions.getUrlAppAdminProd();
const urlBaseAppDev = functions.getUrlAppAdminDev();
const urlBaseApp = process.env.USERDOMAIN == 'DESKTOP-O3O462B' ? urlBaseAppDev : urlBaseAppProd;

module.exports = {

    updatePassword: async (req, res) => {
        const user = req.body;
        const passwordHashed = bcrypt.hashSync(user.password, 10);
        user.password = passwordHashed;
        // console.log(user)
        const newUser = await db.User.update(user, { where: { nombre: "Ramiro"}})
        res.redirect(urlBaseApp + "/admin")
    },

    admin: (req, res) => {
        // console.log("-------------->",functions.getSession())
        const access = functions.getSession();
        res.render("index.ejs", {access})
    },

    login: async (req, res) => {
        const password = req.body.password;
        const admin = await db.User.findAll({
            where: {
                nombre: "Ramiro"
            }
        })

        if(bcrypt.compareSync(password, admin[0].password)){
            await admin.length ? functions.setSession(true) : functions.setSession(false);
            res.redirect(urlBaseApp + "/admin")
        } else {
            const access = false;
            const error = "Contraseña Incorrecta";
            res.render("index.ejs", {access,error})
        }

    },

    logout: async (req, res) => {
        await functions.setSession(false);
        const access = functions.getSession();
        res.render("index", { access })
    }

}