const fs = require("fs");
const path = require("path");
const mainfunctions = require("./main");

const pathCanchaYhorario = path.join(__dirname,"../database/canchayhorario.json");
const pathReserves = path.join(__dirname,"../database/reserves.json");
const pathPage = path.join(__dirname,"../database/dataproject.json");

const nodemailer = require("nodemailer");
const HTMLreserveHistory = require("./historyReserveEmail");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "rsmazzucco@gmail.com",
        pass: process.env.NODEMAILER_PASS,
    },
});

module.exports = {

    create: (body) => {
        const dataCanchaYhorarioJSON = fs.readFileSync(pathCanchaYhorario, {encoding: "utf-8"});
        const CanchaYhorarioData = JSON.parse(dataCanchaYhorarioJSON);
        const dataPageJSON = fs.readFileSync(pathPage, {encoding: "utf-8"});
        const pageData = JSON.parse(dataPageJSON);
        const dataReservesJSON = fs.readFileSync(pathReserves, {encoding: "utf-8"});
        const ReservesData = JSON.parse(dataReservesJSON);
        const horariosOnDB = CanchaYhorarioData[0].options.map( option => { return option.horario}); // Array de horarios.

        const response = [];
        const time = parseInt(mainfunctions.getTime().slice(0,3));
        const timeToReserve = parseInt(body.horario.slice(0,3))

        if(time >= timeToReserve){
            response.push({error: true, message: "Es muy tarde para reservar ese horario.!"})
        } else {

            const lastId = ReservesData.length == 0 ? 0 : pageData.reservas.total;

            const newReserve = {
                id: lastId + 1,
                ...body,
                date: mainfunctions.getDate()
            }

            ReservesData.push(newReserve);
            pageData.reservas.total = pageData.reservas.total + 1;

            fs.writeFileSync(pathReserves,JSON.stringify(ReservesData,null," "));
            fs.writeFileSync(pathPage,JSON.stringify(pageData,null," "));

            const newdataReservesJSON = fs.readFileSync(pathReserves, {encoding: "utf-8"});
            const newReservesData = JSON.parse(newdataReservesJSON);

            const newreservationsaved = newReservesData.find( reserve => reserve.id == newReserve.id);

            if(newreservationsaved){

                const horarioPosition = horariosOnDB.indexOf(newreservationsaved.horario)
                response.push(newreservationsaved);

                // Reserve a cancha and horario on canchayhorario.json. (Reserves of the day)
                CanchaYhorarioData[body.cancha - 1].options[horarioPosition].reservado = true;
                CanchaYhorarioData[body.cancha - 1].options[horarioPosition].reserve_id = newreservationsaved.id;

                fs.writeFileSync(pathCanchaYhorario,JSON.stringify(CanchaYhorarioData,null," "));
            } else {
                response.push({error: true, message: "Reservation failed."});
            }
        }

        return response[0];
    },

    getReserves: () => {

        const dataReservesJSON = fs.readFileSync(pathReserves, {encoding: "utf-8"});
        const ReservesData = JSON.parse(dataReservesJSON);

        return ReservesData;
    },

    getCanchayhorario: (cancha, horario) => {

        const dataCanchaYhorarioJSON = fs.readFileSync(pathCanchaYhorario, {encoding: "utf-8"});
        const CanchaYhorarioData = JSON.parse(dataCanchaYhorarioJSON);
        const response = [];

        if(cancha && horario){
            const horariosOnDB = CanchaYhorarioData[0].options.map( option => { return option.horario}); // Array de horarios.
            const horarioPosition = horariosOnDB.indexOf(horario);
            const canchayhorario = CanchaYhorarioData[cancha - 1].options[horarioPosition];

            response.push(canchayhorario);

        } else {
            response.push(...CanchaYhorarioData)
        }

        return response;
    },

    getReserveById: (id) => {

        const dataReservesJSON = fs.readFileSync(pathReserves, {encoding: "utf-8"});
        const ReservesData = JSON.parse(dataReservesJSON);

        const reserve = ReservesData.find( reserve => reserve.id == Number(id));

        return reserve;
    },

    getReservesOfTheDay: () => {

        const dataReservesJSON = fs.readFileSync(pathReserves, {encoding: "utf-8"});
        const ReservesData = JSON.parse(dataReservesJSON);
        const response = [];

        const date = mainfunctions.getDate();
        const reservesoftheday = ReservesData.filter(reserve => reserve.date.slice(0,10) == date);

        reservesoftheday.length
            ? response.push(...reservesoftheday)
            : response.push({error: true, message: "No reservation today!"});

            return response;
    },

    getDataPage: (data, data2) => {
        const dataPage = {
            header: [...data.page.header.links],
            section: {...data.page.section},
            footer: {
                redessociales: [...data.page.footer.redessociales],
                contacto: [...data.page.footer.contacto]
            }
        }

        const horarios = [];

        data2.map( cancha => {

            cancha.options.map( horario => {
                horarios.push(horario);
            })

        })

        return {dataPage,data2,horarios};
    },

    modifyCanchayhorario: (canchaToReserve, horarioToReserve, id) => {
        const dataCanchaYhorarioJSON = fs.readFileSync(pathCanchaYhorario, {encoding: "utf-8"});
        const CanchaYhorarioData = JSON.parse(dataCanchaYhorarioJSON);
        const response = [];

        const cancha = canchaToReserve ? canchaToReserve - 1 : "";
        const horarioPosition = horarioToReserve ? horariosOnDB.indexOf(horarioToReserve) : "";

        const canchaAfter = cancha && horarioPosition
            ? CanchaYhorarioData[cancha].options[horarioPosition].reservado
            : null;

        if(canchaToReserve && horarioToReserve){
            CanchaYhorarioData[cancha].options[horarioPosition].reservado = true
            CanchaYhorarioData[cancha].options[horarioPosition].reserve_id = id
        }

        const canchaBefore = CanchaYhorarioData[cancha].options[horarioPosition].reservado;

        if(canchaAfter != canchaBefore){
            response.push({error: true, message: "Reserve cancha y horario failed."})
        } else {
            fs.writeFileSync(pathCanchaYhorario,JSON.stringify(CanchaYhorarioData,null," "));
            response.push(...CanchaYhorarioData);
        }

        return response;
    },

    modifyOneCanchayhorarioById: (id) => {
        const dataCanchaYhorarioJSON = fs.readFileSync(pathCanchaYhorario, {encoding: "utf-8"});
        const CanchaYhorarioData = JSON.parse(dataCanchaYhorarioJSON);

        const CanchayhorarioToCancel = [];
        let error = {};

        CanchaYhorarioData.map( cancha=> {

            const findCanchaYhorarioToCancel = cancha.options.find( option => option.reserve_id == id );

            if(typeof findCanchaYhorarioToCancel != "undefined"){
                CanchayhorarioToCancel.push(findCanchaYhorarioToCancel)
            } else {
                error = { error: true, message: `El id ${id} no coincide con ninguna cancha y horario reservado` };
            }

        })

        if(CanchayhorarioToCancel.length){
            const horarioToCancel =
                CanchaYhorarioData[CanchayhorarioToCancel[0].cancha - 1].options.indexOf(CanchayhorarioToCancel[0]);

            CanchaYhorarioData[CanchayhorarioToCancel[0].cancha - 1].options[horarioToCancel].reservado = false;
        }

        fs.writeFileSync(pathCanchaYhorario,JSON.stringify(CanchaYhorarioData,null," "));

        return error;
    },

    modifyAllCanchayhorarios: () => {

        const dataCanchaYhorarioJSON = fs.readFileSync(pathCanchaYhorario, {encoding: "utf-8"});
        const CanchaYhorarioData = JSON.parse(dataCanchaYhorarioJSON);
        const response = [];

        CanchaYhorarioData.map( async cancha => {

            await cancha.options.map( option => {
                option.reservado = false
                option.reserve_id = ""
            });

        });

        const allAreTheSame = [];

        CanchaYhorarioData.map(async cancha => {

            await cancha.options.map(option => {
                allAreTheSame.push(option.reservado)
            });

        });
        const checkAreAllTheSame = (object) => object == false;
        console.log(allAreTheSame.every(checkAreAllTheSame))

        if(allAreTheSame.every(checkAreAllTheSame)){
            fs.writeFileSync(pathCanchaYhorario, JSON.stringify(CanchaYhorarioData,null," "));
            response.push(...CanchaYhorarioData);
        } else {
            response.push({error: true, message: "The modification of all cancha y horario are failed."});
        }

        return response;
    },

    delete: async (id, arrayId) => {

        const dataReservesJSON = fs.readFileSync(pathReserves, {encoding: "utf-8"});
        const ReservesData = JSON.parse(dataReservesJSON);

        const response = [];

        if(arrayId){
            const arrayWithObjectDeleted = await mainfunctions.deleteByArrayId(arrayId, ReservesData);
            const errors = [];

            arrayId.map( elementId => {
                const reserveDeleted = arrayWithObjectDeleted.find( reserve => reserve.id == elementId );

                if(reserveDeleted){
                    errors.push({error: true, message: `Reserve with id ${elementId} was not deleted!`})
                }
            })

            if(errors.length){
                response.push({errors: errors, data: arrayWithObjectDeleted});
            } else {
                response.push(...arrayWithObjectDeleted);
            }

            fs.writeFileSync(pathReserves,JSON.stringify(ReservesData,null," "));
        }

        if(id > 0){

            const arrayWithObjectDeleted = ReservesData.filter( reserve => reserve.id != id );

            const reserveDeleted = arrayWithObjectDeleted.find( reserve => reserve.id == id);

            if(reserveDeleted){
                response.push({errors: true, message: `Reserve with id ${id} was not deleted!`});
            } else {
                response.push(...arrayWithObjectDeleted);
                fs.writeFileSync(pathReserves,JSON.stringify(arrayWithObjectDeleted,null," "));
            }

        }

        return response;
    },

    sendHistoryByEmail: async () => {
        const dataReservesJSON = fs.readFileSync(pathReserves, {encoding: "utf-8"});
        const ReservesData = JSON.parse(dataReservesJSON);

        const message = HTMLreserveHistory.getHTMLreserveHistory(ReservesData);

        async function main(){

            const info = await transporter.sendMail({
                from: '"Tu Marca" <rsmazzucco@gmail.com>',
                to: `<ramazzucco@hotmail.com>`,
                subject: "Historial de Reservas.",
                html: message
            });

            console.log("Message sent: %s", info.messageId);

            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

            return info;
        }

        const sendEmail = await main().catch(error => { return error });

        return sendEmail;
    },

    getOptionsResponseForm: (string, object, errorMsg) => {
        let data = {};

        if(string == "sendReserve"){
            data = {
                action: "sendReserve",
                displayForm: "d-flex flex-column",
                displayResponse: "d-none",
                color: "primary",
                headerTitle: "Reserva tu cancha",
                icon: "",
                title: "",
                content: ""
            }
        }
        if(string == "already reserved"){
            data = ({
                action: "failed",
                displayForm: "d-none",
                displayResponse: "d-flex",
                color: "danger",
                headerTitle: "Error!",
                icon: "exclamation-circle",
                title: "lo sentimos!",
                content: "El horario seleccionado ya esta reservado.",
                button: true
            })
        }
        if(string == "succefull"){
            data = ({
                action: "succefull",
                displayForm: "d-none",
                displayResponse: "d-flex",
                color: "success",
                headerTitle: "Reserva Exitosa",
                icon: "check-circle",
                title: "sus datos",
                content:`${object.name + " " + object.lastname} ha reservado la Cancha N° ${object.cancha} a las ${object.horario} Hs. Su Telefono es: ${object.telefono}`
            })
        }
        if(string == "failed"){
            data = ({
                action: "failed",
                displayForm: "d-none",
                displayResponse: "d-flex",
                color: "danger",
                headerTitle: "Error!",
                icon: "exclamation-circle",
                title: "lo sentimos!",
                content: errorMsg
            })
        }

        return data;
    },

};
