const fs = require("fs");
const path = require("path");
const pathPage = path.join(__dirname,"../database/dataproject.json");
const dataPageJSON = fs.readFileSync(pathPage, {encoding: "utf-8"});
const pageData = JSON.parse(dataPageJSON);
const pathCanchaYhorario = path.join(__dirname,"../database/canchayhorario.json");
const dataCanchaYhorarioJSON = fs.readFileSync(pathCanchaYhorario, {encoding: "utf-8"});
const CanchaYhorarioData = JSON.parse(dataCanchaYhorarioJSON);
const pathReserves = path.join(__dirname,"../database/reserves.json");
const dataReservesJSON = fs.readFileSync(pathReserves, {encoding: "utf-8"});
const ReservesData = JSON.parse(dataReservesJSON);
const horariosOnDB = CanchaYhorarioData[0].options.map( option => { return option.horario}); // Array de horarios.
const mainfunctions = require("../functions/main");
const functions = require("../functions/reserves");
const functionsAdmin = require("../functions/admin");
const { modifyOneReserve } = require("../functions/reserves");

module.exports = {

    getReserves: async (req, res) => {

        res.json({
            meta: {
                status: 200
            },
            data: ReservesData
        });

    },

    getCanchaYhorario: async (req, res) => {

        res.json({
            meta: {
                status: 200
            },
            data: CanchaYhorarioData
        })

    },

    getReservesByCanchaYhorario: async (req, res) => {

        const reserve = ReservesData.find( reserve => reserve.id == Number(req.params.id));

        res.json({
            meta: {
                status: 200,
            },
            data: reserve
        })
    },

    modifyReserve: async (req, res) => {

        const cancha = req.body.cancha - 1;
        const horarioPosition = horariosOnDB.indexOf(req.body.horario);

        req.body.reserve
            ? CanchaYhorarioData[cancha].options[horarioPosition].reservado = true
            : CanchaYhorarioData[cancha].options[horarioPosition].reservado = false

        await fs.writeFileSync(pathCanchaYhorario, JSON.stringify(CanchaYhorarioData,null," "));

        res.json({
            meta: {
                status: 200,
                reserve: CanchaYhorarioData[cancha]
            }
        })

    },

    resetReserves: async (req, res) => {
        CanchaYhorarioData.map(cancha => {
            cancha.options.map(option => {
                option.reservado = false
            });
        });

        await fs.writeFileSync(pathCanchaYhorario, JSON.stringify(CanchaYhorarioData,null," "));

        res.json({
            meta: {
                status: 200
            },
            data: CanchaYhorarioData
        })
    },

    reservesOfTheDay: async (req, res) => {

        const date = functions.getDate();
        const reserves = await ReservesData.filter(reserve => reserve.date.slice(0,10) == date);

        res.json({
            meta: {
                statua: 200,
                reserves: reserves.length
            },
            data: reserves,
        })
    },

    sendHistoryByEmail: async (req, res) => {
        const historySent = await functions.sendHistoryByEmail(ReservesData);

        res.json({
            meta: {
                status: 200,
                totalItems: ReservesData.length
            },
            data: historySent

        })
    },

    create: async (req, res) => {

        // console.log("req.errors: ",req.errors)

        const {dataPage, horarios} = functions.getDataPage(pageData,CanchaYhorarioData);
        const horarioPosition = horariosOnDB.indexOf(req.body.horario);

        if(req.body.cancha && req.body.horario){

            // Si falla la validacion, consulta si el horario que mandan ya esta reservado.
            const horarioToReserve = CanchaYhorarioData[req.body.cancha - 1].options[horarioPosition].reservado;
            const options = functions.getOptionsResponseForm("already reserved");

            horarioToReserve == true
                ? res.render("index.ejs",{dataPage,horarios,CanchaYhorarioData,options})
                : "";

        }

        // Si el horario no esta reservado.
        if(req.errors.length){
            const options = functions.getOptionsResponseForm("sendReserve");
            res.render("index.ejs", {dataPage,horarios,CanchaYhorarioData,options, errors: req.errors})
        } else {

            // Create a new reserve on reserves.json (Historys reserve)
            let lastId = ReservesData.length == 0 ? id = 0 : pageData.reservas.total;

            const newReserve = {
                id: lastId + 1,
                ...req.body,
                date: functions.getDate()
            }

            ReservesData.push(newReserve);
            pageData.reservas.total = pageData.reservas.total + 1;

            const lastReserve = ReservesData[ReservesData.length - 1];

            let options = {};

            if(lastReserve.id == newReserve.id){

                const reserveConfirmationEmail = await functions.sendReserveConfirmByEmail(newReserve);

                await fs.writeFileSync(pathReserves, JSON.stringify(ReservesData,null," "));
                await fs.writeFileSync(pathPage,JSON.stringify(pageData,null," "));

                options =  functions.getOptionsResponseForm("succefull", lastReserve);

            } else {
                options =  functions.getOptionsResponseForm("failed")
            }

            // Reserve a cancha and horario on canchayhorario.json. (Reserves of the day)
            CanchaYhorarioData[req.body.cancha - 1].options[horarioPosition].reservado = true;
            CanchaYhorarioData[req.body.cancha - 1].options[horarioPosition].reserve_id = lastId + 1;

             await fs.writeFileSync(pathCanchaYhorario, JSON.stringify(CanchaYhorarioData,null," "));


            res.render("index.ejs",{dataPage,horarios,CanchaYhorarioData,options})
        }
    },

    delete: async (req, res) => {

        const id = Number(req.params.id)
        let newArrayReserve = [];
        const errors = [];

        if(id == 0){

            const arrayWithObjectDeleted = await mainfunctions.deleteByArrayId(req.body.ids, ReservesData);

            if(arrayWithObjectDeleted.errors.length){
                errors.push(...arrayWithObjectDeleted.errors)
            }

            newArrayReserve = arrayWithObjectDeleted.data;
        } else {

            const arrayWithObjectDeleted = await ReservesData.filter( reserve => reserve.id != id );

            newArrayReserve = arrayWithObjectDeleted;

            const canchayhorarioModified = functions.modifyOneCanchayhorarioById(id);

            if (canchayhorarioModified.error){
                errors.push(canchayhorarioModified)
            }
        }

        const response =  await mainfunctions.saveOnDB("reserves",newArrayReserve,id);

        if(response){
            errors.push(...response);
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