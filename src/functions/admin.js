const fs = require("fs");
const path = require("path");
const usersPath = path.join(__dirname, "../database/users.json");

const bcrypt = require("bcrypt");

module.exports = {

    create: (user) => {
        const usersDataJSON = fs.readFileSync(usersPath, { encoding: "utf-8" });
        const usersData = JSON.parse(usersDataJSON);

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

                    user.token = token;
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

};
