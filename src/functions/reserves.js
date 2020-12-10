let db = require("../database/models");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


module.exports = {

    getCanchaYhorario: async () => {
        const cancha_1 = await db.Cancha_1.findAll();
        const cancha_2 = await db.Cancha_2.findAll();
        const cancha_3 = await db.Cancha_3.findAll();
        const cancha_4 = await db.Cancha_4.findAll();

        return [cancha_1, cancha_2, cancha_3, cancha_4];
    },

    modify: async (cancha, horario, reservado, reserveid) => {
        if (cancha === 1) {
            const cancha_1 = await db.Cancha_1.findAll();
            reservado === true
                ? (cancha_1.reservado = true)
                : (cancha_1.reservado = false);
            cancha_1.reserve_id = reserveid;
            const reserveModified = await db.Cancha_1.update(cancha_1, {
                where: {
                    hora: horario,
                },
            });
        } else if (cancha === 2) {
            const cancha_2 = await db.Cancha_2.findAll();
            reservado === true
                ? (cancha_2.reservado = true)
                : (cancha_2.reservado = false);
            cancha_2.reserve_id = reserveid;
            const reserveModified = await db.Cancha_2.update(cancha_2, {
                where: {
                    hora: horario,
                },
            });
        } else if (cancha === 3) {
            const cancha_3 = await db.Cancha_3.findAll();
            reservado === true
                ? (cancha_3.reservado = true)
                : (cancha_3.reservado = false);
            cancha_3.reserve_id = reserveid;
            const reserveModified = await db.Cancha_3.update(cancha_3, {
                where: {
                    hora: horario,
                },
            });
        } else if (cancha === 4) {
            const cancha_4 = await db.Cancha_4.findAll();
            reservado === true
                ? (cancha_4.reservado = true)
                : (cancha_4.reservado = false);
            cancha_4.reserve_id = reserveid;
            const reserveModified = await db.Cancha_4.update(cancha_4, {
                where: {
                    hora: horario,
                },
            });
        }
    },

    resetReservesOfTheDay: async () => {
        const cancha_1 = await db.Cancha_1.update(
            { reservado: false },
            { where: { reservado: true } }
        );
        const cancha_2 = await db.Cancha_2.update(
            { reservado: false },
            { where: { reservado: true } }
        );
        const cancha_3 = await db.Cancha_3.update(
            { reservado: false },
            { where: { reservado: true } }
        );
        const cancha_4 = await db.Cancha_4.update(
            { reservado: false },
            { where: { reservado: true } }
        );
    },

    selectCanchaYhorario: async (id) => {
        let cancha = "";

        if (id == 1) {
            const cancha_1 = await db.Cancha_1.findAll();
            cancha = cancha_1;
        } else if (id == 2) {
            const cancha_2 = await db.Cancha_2.findAll();
            cancha = cancha_2;
        } else if (id == 3) {
            const cancha_3 = await db.Cancha_3.findAll();
            cancha = cancha_3;
        } else if (id == 4) {
            const cancha_4 = await db.Cancha_4.findAll();
            cancha = cancha_4;
        }
        return cancha;
    },

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

    sendMesagge: (data) => {

        const newMesagge = `Hola ${data.nombre} ${data.apellido}!,\n\nha reservado la cancha N° ${data.cancha} a las ${data.horario}.\n\nTiene 1hs para abonar la reserva, de lo contrario la misma será cancelada automaticamente por el sistema.`

        client.messages
            .create({
                body: newMesagge,
                from: 'whatsapp:+14155238886',
                to: `whatsapp:+549${data.telefono}`
            })
            .then(message => console.log(message.sid))
            .done();

    },

};
