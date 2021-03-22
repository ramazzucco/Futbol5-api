const fs = require("fs");
const path = require("path");
const usersPath = path.join(__dirname, "../database/users.json");
const sessionsPath = path.join(__dirname, "../database/sessions.json");

const bcrypt = require("bcrypt");
const { response } = require("express");

const developer = process.env.MY_PASS;

module.exports = {

    create: (user) => {
        const usersDataJSON = fs.readFileSync(usersPath, { encoding: "utf-8" });
        const usersData = JSON.parse(usersDataJSON);
        const sessionsDataJSON = fs.readFileSync(sessionsPath, { encoding: "utf-8" });
        const sessionsData = JSON.parse(sessionsDataJSON);

        const response = [];

        const userFind = usersData.find( userDB => userDB.name == user.name && userDB.lastname == user.lastname );

        if(userFind){
            response.push({error: true, field: "key", message: "There is already a user with that first and last name!"});
        } else {

            const passwordHash = bcrypt.hashSync(user.password, 10);
            const keyHash = bcrypt.hashSync(user.key, 10);
            const token = bcrypt.hashSync(user.key, 12);

            user.password = passwordHash;
            user.key = keyHash;
            usersData.push(user);

            fs.writeFileSync(usersPath,JSON.stringify(usersData,null," "));

            user.session = true;
            user.token = token;
            sessionsData.push(user)

            fs.writeFileSync(sessionsPath,JSON.stringify(sessionsData,null," "));

            response.push(user);

        }

        return response[0];
    },

    getUserPosition: (user) => {
        const usersDataJSON = fs.readFileSync(usersPath, { encoding: "utf-8" });
        const usersData = JSON.parse(usersDataJSON);

        const positionFind = usersData.map( u => {
            if(u.password == user.password){
                return usersData.indexOf(u)
            }
        })
        const position = positionFind.filter( positionUser => positionUser != undefined );

        return position[0];
    },

    getUser: (pass) => {
        const usersDataJSON = fs.readFileSync(usersPath, { encoding: "utf-8" });
        const usersData = JSON.parse(usersDataJSON);

        const key = `${process.env.MY_PASS}`;
        const token = bcrypt.hashSync(key, 12);
        const response = {
            error: "",
            data: {}
        };

        if(usersData.length){
            usersData.map( user => {

                if(bcrypt.compareSync(pass, user.password)) {

                    user.status == "admin" ? user.token = token : ""
                    response.error = false;
                    response.data = user;

                } else {

                    response.error = true;
                    response.data = {
                        field: "password",
                        message: "Wrong Password!",
                    };

                }

            })
        } else {

            response.error = true;
            response.data = {
                field: "password",
                message: "User dosn´t exist!",
            };

        }

        return response;
    },

    // setSession: (user) => {
    //     const sessionsDataJSON = fs.readFileSync(sessionsPath, { encoding: "utf-8" });
    //     const sessionsData = JSON.parse(sessionsDataJSON);

    //     const findSession = sessionsData.find(session => session.password == user.password);

    //     if(findSession){
    //         console.log("Ya existe la session")
    //     } else {
    //         user.session = true;
    //         sessionsData.push(user);
    //     }

    //     fs.writeFileSync(sessionsPath, JSON.stringify(sessionsData,null," "));

    // },

    // getSession: () => {
    //     const key = `${process.env.MY_PASS}`;
    //     const sessionsDataJSON = fs.readFileSync(sessionsPath, { encoding: "utf-8" });
    //     const sessionsData = JSON.parse(sessionsDataJSON);
    //     const response = {
    //         error:"",
    //         data: {}
    //     };

    //     if(sessionsData.length != 0){

    //         sessionsData.map( user => {

    //             if(bcrypt.compareSync(key, user.key)){
    //                 response.error = false;
    //                 response.data = user;
    //             }

    //         });

    //     } else {
    //         response.error = true;
    //         response.data = {error: true, message: "No sessions!"};
    //     }

    //     return response;
    // },

    // closeSession: (user) => {
    //     const sessionsDataJSON = fs.readFileSync(sessionsPath, { encoding: "utf-8" });
    //     const sessionsData = JSON.parse(sessionsDataJSON);
    //     const sessionDeleted = sessionsData.filter(session => session.password != user.password);

    //     fs.writeFileSync(sessionsPath, JSON.stringify(sessionDeleted,null," "))
    // }
};
