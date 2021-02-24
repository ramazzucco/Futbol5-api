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

const nodemailer = require("nodemailer");
const HTMLemail = require("./reserveConfirmationEmail");

module.exports = {

    getDate: () => {
        const date = new Date();
        const fecha =
            `${date.getDate()}` +
            "-" +
            `${date.getMonth() + 1}` +
            "-" +
            `${date.getFullYear()}`;
        return fecha;
    },

    getTime: () => {

        const date = new Date();
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const seconds = date.getUTCSeconds();

        const time = `${hours}:${("0" + Math.floor(minutes)).slice(-2)}:${("0" + Math.floor(seconds)).slice(-2)}`

        return time;
    },

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
               const elementFind = element.find( elem => elem.id == id);

               if(elementFind != "undefined"){
                    errors.push({ message: `Id ${id} was not deleted`, data: elem });
                }
            })

            fs.writeFileSync(pathElement,JSON.stringify(data,null," "));
        } else {
            const elementFind = element.find( elem => elem.id == ids);

            if(elementFind != "undefined"){
                errors.push({ message: `Id ${ids} was not deleted`, data: elementFind});
            }

            fs.writeFileSync(pathElement,JSON.stringify(data,null," "));
        }

        return errors;
    },

    saveDataProject: (data) => {

        const dataPage = [pageData];

        dataPage.splice(0,1,data)

        fs.writeFileSync(pathPage,JSON.stringify(dataPage[0],null," "));

        return dataPage[0];
    },

    deleteByArrayId: async (ids, arrayWhithObjectToDelete) => {

        const data = arrayWhithObjectToDelete;

        ids.forEach( async id => {

            await data.map( reserve => {

                if(reserve.id == id){
                    const findReserve = data.find( reserve => reserve.id == id);
                    const positionIdOnReservesData = data.indexOf(findReserve);

                    data.splice(positionIdOnReservesData, 1);
                }

            })

        });

        return data;
    },

    sendReserveConfirmByEmail: (data) => {

        const response = [];

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "rsmazzucco@gmail.com",
                pass: process.env.NODEMAILER_PASS,
            },
        });

        const message = HTMLemail.getHTMLemail(data);

        async function main(){

            const info = await transporter.sendMail({
                from: '"Reserva Exitosa" <rsmazzucco@gmail.com>',
                to: `${data.email}`,
                subject: "Reserva Exitosa!",
                html: message
            });

            console.log("Message sent: %s", info.messageId);

            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

            return info;
        }

        const sendEmailConfirmation = main().catch(error => { return error });

        sendEmailConfirmation.Promise
            ? response.push({error: true, message: "The sent email failed."})
            : response.push(sendEmailConfirmation);


        return response;
    },
}