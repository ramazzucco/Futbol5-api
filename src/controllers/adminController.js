const fs = require("fs");
const path = require("path");
const usersPath = path.join(__dirname, "../database/users.json");
const usersDataJSON = fs.readFileSync(usersPath, { encoding: "utf-8" });
const usersData = JSON.parse(usersDataJSON);
const sessionsPath = path.join(__dirname, "../database/sessions.json");
const sessionsDataJSON = fs.readFileSync(sessionsPath, { encoding: "utf-8" });
const sessionsData = JSON.parse(sessionsDataJSON);
const functions = require("../functions/admin");
const bcrypt = require("bcrypt");
const urlBaseApi = process.env.USERDOMAIN == "DESKTOP-O3O462B"
    ? process.env.URL_API_DEV
    : process.env.URL_API_PROD;
const urlBaseApp =
    process.env.USERDOMAIN == "DESKTOP-O3O462B"
        ? process.env.URL_APP_DEV
        : process.env.URL_APP_PROD;
const token = bcrypt.hashSync(process.env.MY_PASS, 10);


module.exports = {

    create: (req, res) => {
        req.errors ? req.errors[0].error = true : "";
        const newUser = req.errors ? req.errors : [req.body];
        const passwordHash = bcrypt.hashSync(req.body.password, 10);
        newUser[0].password = passwordHash;
        usersData.push(newUser[0]);

        if(newUser[0].status == "admin" && key == newUser[0].key){
            fs.writeFileSync(usersPath, JSON.stringify(usersData, null, " "));
            functions.setSession(newUser[0]);
            res.json({
                meta: {
                    status: 200,
                    message: "Admin creado",
                },
                data: newUser
            })
        } else {
            res.redirect(`${urlBaseApi}`);
        }
    },

    login: (req, res) => {
        const admin = [];
        const password = req.body.password;
        const sessionsAdmin = [];

        sessionsData.map( session => {
            session.status == "admin" && session.key == key ? sessionsAdmin.push(session) : ""
        })

        if(sessionsAdmin.length){
            admin.push(sessionsAdmin[sessionsAdmin.length - 1])
        } else {
            if (password == "") {
                admin.push({ error: false, message: "No session!" });
            } else {
                usersData.map( user => {
                    if(bcrypt.compareSync(password, user.password)) {
                        user.status == "admin" ? user.token = token : ""
                        admin.push(user);
                        functions.setSession(user);
                    } else {
                        admin.push({
                            error: true,
                            field: "password",
                            message: "Wrong Password!",
                        });
                    }
                });
            }
        }

        res.json({
            meta: {
                status: 200,
            },
            data: admin,
        });
    },

    updatePassword: async (req, res) => {

        const user = [];

        let userPositionOnDB;

        usersData.map( userDB => {

            if(bcrypt.compareSync(req.body.oldpassword, userDB.password)){
                user.push(userDB)
            }

            userPositionOnDB = usersData.indexOf(user[0]);

        });


        if(!user.length){

            user.push({
                error: true,
                field: "oldpassword",
                message: "Wrong Password!",
            })

        } else {

            if(req.body.newpassword == req.body.repeatnewpassword){

                const passwordHash = bcrypt.hashSync(req.body.newpassword,10);

                usersData[userPositionOnDB].password = passwordHash;

                user.length = 0;

                user.push(usersData[userPositionOnDB]);

                await fs.writeFileSync(usersPath,JSON.stringify(usersData,null," "))

            } else {

                user.length = 0;

                user.push({
                    error: true,
                    field: "repeatnewpassword",
                    message: "New Password dosn`t match!"
                })

            }
        }

        res.json({
            meta:{
                status: 200
            },
            data: user
        });
    },

    logout: async (req, res) => {

        functions.closeSession(req.body);

        res.json({
            meta:{
                status: 200,
                url: `${urlBaseApp}`
            }
        });
    },
};
