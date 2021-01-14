const fs = require("fs");
const path = require("path");

const pathCanchaYhorario = path.join(__dirname,"../database/canchayhorario.json");
const dataCanchaYhorarioJSON = fs.readFileSync(pathCanchaYhorario, {encoding: "utf-8"});
const CanchaYhorarioData = JSON.parse(dataCanchaYhorarioJSON);

const pathReserves = path.join(__dirname,"../database/reserves.json");
const dataReservesJSON = fs.readFileSync(pathReserves, {encoding: "utf-8"});
const ReservesData = JSON.parse(dataReservesJSON);

const pathPage = path.join(__dirname,"../database/dataproject.json");
const dataPageJSON = fs.readFileSync(pathPage, {encoding: "utf-8"});
const pageData = JSON.parse(dataPageJSON);

const pathUsers = path.join(__dirname,"../database/users.json");
const dataUsersJSON = fs.readFileSync(pathUsers, {encoding: "utf-8"});
const usersData = JSON.parse(dataUsersJSON);

const pathSessions = path.join(__dirname,"../database/dataproject.json");
const dataSessionsJSON = fs.readFileSync(pathSessions, {encoding: "utf-8"});
const sessionsData = JSON.parse(dataSessionsJSON);


module.exports = {

    saveOnDB: (saveIn, data, ids) => {

        let element = [];
        let pathElement = "";

        const errors = [];

        if(saveIn == "reserves"){

            element = ReservesData;
            pathElement = pathReserves

        } else if (saveIn == "users"){

            element = usersData;
            pathElement = pathUsers;

        } else if (saveIn == "sessions"){

            element = sessionsData;
            pathElement = pathSessions;

        }

        if(Array.isArray(ids)){
           ids.map( id => {
               const elementFind = element.find( elem => elem.id == id)

               if(elementFind != "undefined"){
                    errors.push({ message: `Id ${id} was not deleted`, data: elem})
                }
            })

            fs.writeFileSync(pathElement,JSON.stringify(data,null," "))
        } else {
            const elementFind = element.find( elem => elem.id == ids)

            if(elementFind != "undefined"){
                errors.push({ message: `Id ${ids} was not deleted`, data: elementFind})
            }

            fs.writeFileSync(pathElement,JSON.stringify(data,null," "))
        }

        return errors;
    },

    deleteByArrayId: (ids, objectToDelete) => {

        const data = objectToDelete;

        const errors = [];

        ids.forEach( async id => {

            await data.map( reserve => {

                if(reserve.id == id){
                    const findReserve = data.find( reserve => reserve.id == id);
                    const positionIdOnReservesData = data.indexOf(findReserve);

                    if(positionIdOnReservesData == -1){
                        errors.push({error: true, message: `Reserve ${id} was not found`})
                    }

                    data.splice(positionIdOnReservesData, 1)
                }

            })

        });

        return {
            data: data,
            errors: errors.length ? errors : false
        };
    },


}