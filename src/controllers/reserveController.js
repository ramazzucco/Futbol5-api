const fs = require("fs");
const path = require("path");
const pathPage = path.join(__dirname,"../database/dataproject.json");
const dataPageJSON = fs.readFileSync(pathPage, {encoding: "utf-8"});
const pageData = JSON.parse(dataPageJSON);

const mainfunctions = require("../functions/main");
const functions = require("../functions/reserves");

module.exports = {

    create: async (req, res) => {

        if(req.body.cancha && req.body.horario){

            // If validation failed, check if the schedule they send is already reserved.
            const CanchaYhorarioData = functions.getCanchayhorario();
            const {dataPage, horarios} = functions.getDataPage(pageData,CanchaYhorarioData);
            const horarioToReserve = functions.getCanchayhorario(req.body.cancha, req.body.horario);
            const options = functions.getOptionsResponseForm("already reserved");

            horarioToReserve.reservado
                ? res.render("index.ejs",{dataPage,horarios,CanchaYhorarioData,options})
                : "";

        }
        // If the schedule its not reserved.
        if(req.errors.length){
            const CanchaYhorarioData = functions.getCanchayhorario();
            const {dataPage, horarios} = functions.getDataPage(pageData,CanchaYhorarioData);
            const options = functions.getOptionsResponseForm("sendReserve");

            res.render("index.ejs", {dataPage,horarios,CanchaYhorarioData,options, errors: req.errors})
        } else {
            // Create a new reserve on reserves.json (Historys reserve)
            const CanchaYhorarioData = functions.getCanchayhorario();
            const {dataPage, horarios} = functions.getDataPage(pageData,CanchaYhorarioData);

            const newreserve = functions.create(req.body);

            let options = {};

            if(!newreserve.error){
                options =  functions.getOptionsResponseForm("succefull", newreserve)
                const reserveConfirmationEmail = await mainfunctions.sendReserveConfirmByEmail(newreserve);
                console.log(reserveConfirmationEmail)
            } else {
                options =  functions.getOptionsResponseForm("failed","",newreserve.message);
            }

            res.render("index.ejs",{dataPage,horarios,CanchaYhorarioData,options})
        }

    },

    getReserves: (req, res) => {

        const reserves = functions.getReserves();

        res.json({
            meta: {
                status: 200
            },
            data: reserves
        });

    },

    getCanchaYhorario: (req, res) => {

        const canchayhorario = functions.getCanchayhorario();

        res.json({
            meta: {
                status: 200
            },
            data: canchayhorario
        })

    },

    getReserveById: (req, res) => {

        const reserve = functions.getReserveById(req.params.id);

        res.json({
            meta: {
                status: 200,
            },
            data: reserve
        })
    },

    modifyCanchayhorario: (req, res) => {

        const modifyCanchayhorario = functions.modifyCanchayhorario(req.body.cancha, req.body.horario);

        res.json({
            meta: {
                status: 200,
                reserve: modifyCanchayhorario
            }
        })

    },

    resetReserves: (req, res) => {

        const resetReserves = functions.modifyAllCanchayhorarios();

        res.json({
            meta: {
                status: 200
            },
            data: resetReserves
        })
    },

    reservesOfTheDay: (req, res) => {

        const reservesoftheday = functions.getReservesOfTheDay();

        res.json({
            meta: {
                statua: 200,
            },
            data: reservesoftheday,
        })
    },

    sendHistoryByEmail: async (req, res) => {

        const historySent = await functions.sendHistoryByEmail();

        res.json({
            meta: {
                status: 200,
            },
            data: historySent

        })
    },

    delete: async (req, res) => {

        const id = Number(req.params.id)
        const newArrayReserve = [];
        const errors = [];

        const response = id == 0 ? await functions.delete(id, req.body.ids) : await functions.delete(id,"");

        if(response[0].errors){
            newArrayReserve.push(...response[0].data);
            errors.push(...response[0].errors);
        } else {
            newArrayReserve.push(...response);
        }

        const canchayhorarioModified = functions.modifyOneCanchayhorarioById(id);

        if (canchayhorarioModified.error){
            errors.push(canchayhorarioModified)
        }

        res.json({
            meta: {
                status: 200
            },
            data: newArrayReserve,
            data2: "",
            errors: errors
        });

    }

}