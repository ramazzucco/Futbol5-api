const fs = require("fs");
const path = require("path");
const usersPath = path.join(__dirname, "../database/users.json");
const usersDataJSON = fs.readFileSync(usersPath, { encoding: "utf-8" });
const usersData = JSON.parse(usersDataJSON);
const functions = require("../functions/admin");
const bcrypt = require("bcrypt");
const urlBaseApi = process.env.USERDOMAIN == "DESKTOP-O3O462B"
    ? process.env.URL_API_DEV
    : process.env.URL_API_PROD;
const key = `${process.env.MY_PASS}`;

module.exports = {

    create: (req, res) => {
        req.errors ? req.errors[0].error = true : "";
        const newUser = req.errors ? req.errors : [req.body];
        const passwordHash = bcrypt.hashSync(req.body.password, 10);
        newUser[0].password = passwordHash;

        if(newUser[0].status == "admin" && key == newUser[0].key){

            const hashedKey = bcrypt.hashSync(newUser[0].key, 10);

            newUser[0].key = hashedKey;

            functions.createUser(newUser[0]);

            functions.setSession(newUser[0]);

            res.json({
                meta: {
                    status: 200,
                    message: "Admin creado",
                },
                data: newUser[0]
            })

        } else {
            res.redirect(`${urlBaseApi}`);
        }
    },

    login: (req, res) => {
        const admin = [];
        const password = req.body.password;

        if(password == ""){
            const findSession = functions.getSession();

            findSession[0] == undefined
                ? admin.push({ error: false, message: "No session!" })
                : admin.push(findSession[0]);
        } else {


            const user = functions.getUser(password);

            if(!user[0].error){

                user[0].session = true

                admin.push(user[0]);

                functions.setSession(user[0]);
            } else {

                admin.push({
                    error: true,
                    field: "password",
                    message: "Wrong password!"
                })
            }

        }


        res.json({
            meta: {
                status: 200,
            },
            data: admin,
        });
    },

    updatePassword: (req, res) => {

        const user = functions.getUser(req.body.oldpassword);

        const userPositionOnDB = usersData.indexOf(user[0]);


        if(user[0].error){

            user[0].field = "oldpassword"

        } else {

            if(req.body.newpassword == req.body.repeatnewpassword){

                const passwordHash = bcrypt.hashSync(req.body.newpassword,10);

                usersData[userPositionOnDB].password = passwordHash;

                user.length = 0;

                user.push(usersData[userPositionOnDB]);

                fs.writeFileSync(usersPath,JSON.stringify(usersData,null," "))

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

    logout: (req, res) => {

        functions.closeSession(req.body);

        res.json({
            meta:{
                status: 200,
                message: "Session close!"
            }
        });
    },
};
