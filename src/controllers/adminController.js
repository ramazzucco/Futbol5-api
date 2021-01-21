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

        const response = {
            status: "",
            error: "",
            data: {}
        }
console.log("ERRORES: ",req.errors)
        if(!req.errors){

            response.error = false

            const userCreated = functions.create(req.body);

            userCreated && userCreated.error
                ? response.error = true
                : response.error = false;
            userCreated && userCreated.error
                ? response.status = 300
                : response.status = 200;

            response.data = userCreated;

        } else {

            response.error = true;
            response.status = 300;
            response.data = req.errors;

        }

        res.json({
            meta: {
                status: response.status
            },
            error: response.error,
            data: response.data
        })
    },

    login: (req, res) => {

        const password = req.body.password;
        const response = {
            status: "",
            error: false,
            data: {}
        }

        if(password == ""){

            const findSession = functions.getSession();

            console.log(findSession)
            findSession.error
                ? response.status = 300
                : response.status = 200;

            response.data = findSession.data

        } else {
            const user = functions.getUser(password);

            if(!user.error){

                functions.setSession(user.data);

                response.status = 200;
                response.error = false;
                response.data = user.data;

            } else {

                response.status = 300;
                response.error = true;
                response.data = user.data
            }

        }


        res.json({
            meta: {
                status: response.status,
            },
            error: response.error,
            data: response.data,
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
