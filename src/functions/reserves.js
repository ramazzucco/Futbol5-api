const fs = require("fs");
const path = require("path");
const pathCanchaYhorario = path.join(__dirname,"../database/canchayhorario.json");
const dataCanchaYhorarioJSON = fs.readFileSync(pathCanchaYhorario, {encoding: "utf-8"});
const CanchaYhorarioData = JSON.parse(dataCanchaYhorarioJSON);
const pathReserves = path.join(__dirname,"../database/reserves.json");
const dataReservesJSON = fs.readFileSync(pathReserves, {encoding: "utf-8"});
const ReservesData = JSON.parse(dataReservesJSON);
const nodemailer = require("nodemailer");
const HTMLemail = require("./reserveConfirmationEmail");
const HTMLreserveHistory = require("./historyReserveEmail");
const { info } = require("console");

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

    getOptionsResponseForm: (string, object) => {
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
                content: "Compruebe su conexion a internet e intentelo nuevamente."
            })
        }

        return data;
    },

    sendReserveConfirmByEmail: (data) => {

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

        return sendEmailConfirmation;
    },

    sendHistoryByEmail: async (reserves) => {

        const message = HTMLreserveHistory.getHTMLreserveHistory(reserves);

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

        const sendEmail = main().catch(error => { return error });

        return sendEmail;
    },

};
