const fs = require("fs");
const path = require("path");
const sessionsPath = path.join(__dirname, "../database/sessions.json");
const sessionsDataJSON = fs.readFileSync(sessionsPath, { encoding: "utf-8" });
const sessionsData = JSON.parse(sessionsDataJSON);

const bcrypt = require("bcrypt");

const developer = process.env.MY_PASS;

const session = [];

module.exports = {
    setSession: async (user) => {
        const findSession = sessionsData.find(session => session.password == user.password);
        findSession ? console.log("Ya existe la session") : sessionsData.push(user);
        await fs.writeFileSync(sessionsPath, JSON.stringify(sessionsData,null," "));
    },

    getSession: (user) => {
        const getUserSession = sessionsData.find( u => u.password == user.password)
        session.push(getUserSession);
        return session;
    },

    closeSession: (user) => {
        const sessionDeleted = sessionsData.filter(session => session.password != user.password);
        fs.writeFileSync(sessionsPath, JSON.stringify(sessionDeleted,null," "))
    }
};
