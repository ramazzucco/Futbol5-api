let db = require("../database/models");
const functions = require("../functions/reserves");

module.exports = {

    getReserves: async (req, res) => {

        const reserves = await db.Reserve.findAll();
        res.json({
            meta: {
                status: 200
            },
            data: reserves
        });

    },

    getReservesByCanchaYhorario: async (req, res) => {

        console.log(req.params.reserveId)
        const reserve = await db.Reserve.findAll({
            where: {
                id: Number(req.params.reserveId),
            }
        })

        res.json({
            meta: {
                status: 200,
            },
            data: reserve[0]
        })
    },

    modifyReserve: async (req, res) => {
        console.log(req.body)
        let modification = "";

        if(req.body.reservado === true || req.body.reservado === false){
            functions.modify(req.body.cancha, req.body.horario, req.body.reservado, req.body.reserveId)
        } else if (req.body.reservado === "cancel"){
            const reserveOnHistory = await db.Reserve.destroy({
                where: {
                    id: req.body.reserveId
                }
            })
            functions.modify(req.body.cancha, req.body.horario, false, req.body.reserveId);
            console.log("Cancel: ",req.body.cancha, req.body.horario)
            modification = `Reserva N°${req.body.reserveId} Cancelada`
        } else if (req.body.reservado === "reset"){
            functions.resetReservesOfTheDay();
            modification = `Todas las reservas del dia fueron reseteadas`
        }

        res.json({
            meta: {
                status: 200,
                reserve: modification
            }
        })

    },

    modifySingleReserve: async (req, res) => {},

    getCanchaYhorario: async (req, res) => {
        const canchas = await functions.getCanchaYhorario();

        res.json({
            meta: {
                status: 200
            },
            data: canchas
        })

    },

    reservesOfTheDay: async (req, res) => {

        const reserves = await db.Reserve.findAll({
            where: {
                fecha: functions.getDate()
            }
        });

        res.json({
            meta: {
                statua: 200,
                reserves: reserves.length
            },
            data: reserves
        })
    },

    selectCanchaYhorario: async (req, res) => {

        res.json({
            meta:{
                status: 200,
                msg: "success"
            },
            data: await functions.selectCanchaYhorario(req.params.id)
        })

    },

    reserve: async (req, res) => {
        console.log("DESDE LA API: ",req.body)

        const reserve = req.body;
        reserve.cancha = Number(req.body.cancha);
        reserve.telefono = Number(req.body.telefono);
        reserve.fecha = functions.getDate()
        const newReserve = await db.Reserve.create(reserve);

        res.json( {
            meta: {
                status: 200,
                msg: "La Reserva Fue Exitosa!"
            },
            data: newReserve,
        });

    },

    delete: async (req, res) => {

        const reserveDeleted = await db.Reserve.destroy({
            where: {
                id: Number(req.params.id)
            }
        });

        const reserve = await db.Reserve.findAll();

        res.json({
            meta: {
                status: 200
            },
            data: reserve
        });

    }

}