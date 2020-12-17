let db = require("../database/models");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "rsmazzucco@gmail.com",
        pass: "cakl jqmk qevs jkvd",
    },
});

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

        const newMessage = `<p>IMPORTANTE! : Tiene 1hs para abonar la reserva, de lo contrario la misma será cancelada automaticamente por el sistema.</p>
        <hr>
        <div style="background: rgb(0,200,0); margin-left: auto; margin-right: auto; width: 50%;margin-top: 10%;margin-bottom: 10%; box-shadow: 0px 0px 9px 7px black; border-radius: 25px; padding: 20px;">
            <div style="border-bottom: 2px solid gray;">
                <h4 style="display: inline; color: rgb(0,100,0); margin-right: 20%;">Tu Marca</h4><h4 style="display: inline-block; color: rgb(0,100,0); font-weight: bold;">La Reserva fue Exitosa!</h4>
            </div>
            <div style="padding: 20px;">
                <h4 >${data.nombre} ${data.apellido}</h4>
                <h4>Numero de Reserva: ${data.id}</h4>
                <h4 style="text-align: center;">Ha Reservado la CANCHA N° ${data.cancha}, a las ${data.horario}.!</h4>
            </div>
        </div><hr>
        <ul><li>Telefono: 4-331122</li><li>Direccion: Calle Falsa 123</li><li>Email: tumarca@gmail.com</li></ul>`

        async function main(){

            const info = await transporter.sendMail({
                from: '"Reserva Exitosa" <rsmazzucco@gmail.com>',
                to: `${data.email}`,
                subject: "Reserva Exitosa!",
                html: newMessage
            });

            console.log("Message sent: %s", info.messageId);

            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        }


        main().catch(console.error);
    },

    sendHistoryReserve: async (reserves) => {

        const message = `
        <div >
            <table>
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Apellido</th>
                        <th scope="col">Email</th>
                        <th scope="col">telefono</th>
                        <th scope="col">Cancha</th>
                        <th scope="col">Horario</th>
                        <th scope="col">Hora Y Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    ${reserves.map((reserve) => {
                        return (
                            `<tr>
                                <td>${reserve.id}</td>
                                <td>${reserve.nombre}</td>
                                <td>${reserve.apellido}</td>
                                <td>${reserve.email}</td>
                                <td>${reserve.telefono}</td>
                                <td>${reserve.cancha}</td>
                                <td>${reserve.horario}</td>
                                <td>${reserve.createdAt}</td>
                            </tr>`
                        );
                    })}
                </tbody>
            </table>
        </div>
        <style type="text/css">
            td {
                border: 1px solid black;
                text-align: center;
            }
        </style>`

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


        main().catch(console.error);
    },

};
