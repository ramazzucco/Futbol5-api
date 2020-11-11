let db = require("../database/models");

module.exports = {

    getReserves: async (req, res) => {

        const reserves = await db.Reserve.findAll();
        res.send("HOLA PUTO MUNDO!")
        // res.json({
        //     meta: {
        //         status: 200
        //     },
        //     data: reserves
        // });

    },

    reserve: async (req, res) => {

        const reserve = req.body;
        reserve.cancha = Number(req.body.cancha);
        reserve.telefono = Number(req.body.telefono);

        const newReserve = await db.Reserve.create(reserve);

        res.json( {
            meta: {
                status: 200
            },
            data: newReserve
        });
    },
    delete: async (req, res) => {

        const reserve = await db.Reserve.findByPk(req.params.id);

        const reserveDeleted = await db.Reserve.destroy({
            where: {
                id: req.params.id
            }
        });

        res.json({
            meta: {
                status: 200
            },
            data: reserve
        });

    }

}