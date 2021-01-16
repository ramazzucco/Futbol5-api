const fs = require("fs");
const path = require("path");
const usersPath = path.join(__dirname, "../database/users.json");
const sessionsPath = path.join(__dirname, "../database/sessions.json");

const bcrypt = require("bcrypt");

const developer = process.env.MY_PASS;

module.exports = {

    createUser: (user) => {
        const usersDataJSON = fs.readFileSync(usersPath, { encoding: "utf-8" });
        const usersData = JSON.parse(usersDataJSON);

        usersData.push(user);

        fs.writeFileSync(usersPath,JSON.stringify(usersData,null," "));
    },

    getUser: (pass) => {
        const userFind = [];
        const key = `${process.env.MY_PASS}`;
        const token = bcrypt.hashSync(key, 10);
        const usersDataJSON = fs.readFileSync(usersPath, { encoding: "utf-8" });
        const usersData = JSON.parse(usersDataJSON);

        usersData.map( user => {

            if(bcrypt.compareSync(pass, user.password)) {

                user.status == "admin" ? user.token = token : ""
                userFind.push(user);

            } else {

                userFind.push({
                    error: true,
                    field: "password",
                    message: "Wrong Password!",
                });

            }

        })

        return userFind;
    },

    setSession: (user) => {
        const sessionsDataJSON = fs.readFileSync(sessionsPath, { encoding: "utf-8" });
        const sessionsData = JSON.parse(sessionsDataJSON);
        const findSession = sessionsData.find(session => session.password == user.password);

        findSession ? console.log("Ya existe la session") : sessionsData.push(user);

        fs.writeFileSync(sessionsPath, JSON.stringify(sessionsData,null," "));
    },

    getSession: () => {
        const session = [];
        const sessionsDataJSON = fs.readFileSync(sessionsPath, { encoding: "utf-8" });
        const sessionsData = JSON.parse(sessionsDataJSON);

        sessionsData.map( user => {
            const mYkey = "Hb%&P4u7#.X3mW_vM";
            const admin = user.status == "admin" ? true : false;
            const key = bcrypt.compareSync(mYkey, user.token);

            console.log("admin & key from sessionsdata.filter: ", admin, mYkey)

            if(admin & key){
                session.push(user)
            }
        });
        console.log("session from getSession: ", session)
        return session[session.length - 1];
    },

    closeSession: (user) => {
        const sessionsDataJSON = fs.readFileSync(sessionsPath, { encoding: "utf-8" });
        const sessionsData = JSON.parse(sessionsDataJSON);
        const sessionDeleted = sessionsData.filter(session => session.password != user.password);

        fs.writeFileSync(sessionsPath, JSON.stringify(sessionDeleted,null," "))
    }
};
