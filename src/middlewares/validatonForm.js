const fs = require("fs");
const path = require("path");
const dataCanchaYhorario = path.join(
    __dirname,
    "../database/canchayhorario.json"
);
const dataCanchaYhorarioJSON = fs.readFileSync(dataCanchaYhorario, {
    encoding: "utf-8",
});
const CanchaYhorarioData = JSON.parse(dataCanchaYhorarioJSON);
const pathReserves = path.join(__dirname, "../database/reserves.json");
const dataReservesJSON = fs.readFileSync(pathReserves, { encoding: "utf-8" });
const ReservesData = JSON.parse(dataReservesJSON);

const numeros = "0123456789-!#$%&/()=?¡¿'|°";

function hasNumber(variable) {
    for (i = 0; i < variable.length; i++) {
        if (numeros.indexOf(variable.charAt(i), 0) != -1) {
            return true;
        }
    }
    return false;
}

const letras = "abcdefghyjklmnñopqrstuvwxyz-!#$%&/()=?¡¿'|°";

function hasLetters(variable) {
    text = variable.toLowerCase();
    for (i = 0; i < text.length; i++) {
        if (letras.indexOf(text.charAt(i), 0) != -1) {
            return true;
        }
    }
    return false;
}

module.exports = (req, res, next) => {
    const error = [];

    // ----------Validacion del campo cancha.
    req.body.cancha == ""
        ? error.push({ field: "cancha", message: "Campo obligatorio." })
        : "";
    req.body.cancha = Number(req.body.cancha);

    //Para que los numeros que envian coincidan con los de la base de datos
    const canchaparamter = CanchaYhorarioData.map((cancha) => {
        return cancha.number;
    });
    const findCancha = canchaparamter.indexOf(req.body.cancha);

    findCancha === -1
        ? error.push({ field: "cancha", message: "Campo obligatorio." })
        : "";

    // -----------Validacion del campo horario.
    req.body.horario == ""
        ? error.push({ field: "horario", message: "Campo obligatorio." })
        : "";

    const horariosParameters = CanchaYhorarioData[0].options.map((option) => {
        return option.horario;
    });
    const findHorario = horariosParameters.indexOf(req.body.horario);

    findHorario === -1
        ? error.push({ field: "horario", message: "Campo obligatorio." })
        : "";

    const cancha = req.body.cancha ? req.body.cancha - 1 : undefined;

    if (cancha != undefined) {
        const horarioreserved = CanchaYhorarioData[cancha].options.filter(
            (option) => {
                option.horario == req.body.horario;
            }
        );

        horarioreserved.reservado
            ? error.push({ field: "horario", message: "Horario reservado." })
            : "";
    }

    // -----------Validacion del campo nombre.
    req.body.name == ""
        ? error.push({ field: "name", message: "Campo obligatorio." })
        : "";

    const name = req.body.name.trim();
    const namehasnumber = hasNumber(name);

    namehasnumber
        ? error.push({
              field: "name",
              message: "No se puede introducir numeros en este campo.",
          })
        : "";

    name != "" && name.length < 3
        ? error.push({ field: "name", message: "Minimo 3 caracteres." })
        : "";

    name != "" && name.length > 15
        ? error.push({ field: "name", message: "Maximo 15 caracteres." })
        : "";

    // -----------Validacion del campo apellido.
    const lastname = req.body.lastname.trim();
    const lastnamehasnumber = hasNumber(lastname);

    lastnamehasnumber
        ? error.push({
              field: "lastname",
              message:
                  "No se puede introducir numeros y/o caracteres en este campo.",
          })
        : "";

    lastname != "" && lastname.length < 3
        ? error.push({ field: "lastname", message: "Minimo 3 caracteres." })
        : "";

    lastname != "" && lastname.length > 20
        ? error.push({ field: "lastname", message: "Maximo 20 caracteres." })
        : "";

    // -----------Validacion del campo email.
    const email = req.body.email.trim();
    const isemail = email.indexOf("@");

    email != "" && isemail == -1
        ? error.push({ field: "email", message: "Email invalido" })
        : "";

    // -----------Validacion del campo telefono.
    req.body.telefono == ""
        ? error.push({ field: "telefono", message: "Campo obligatorio." })
        : "";

    const telefono = req.body.telefono.trim();
    const hasletters = hasLetters(telefono);

    telefono != "" && telefono.length != 9
        ? error.push({
              field: "telefono",
              message: "Numero no valido, controle la cantidad de caracteres",
          })
        : "";

    hasletters
        ? error.push({
              field: "telefono",
              message:
                  "No se pueden ingresar letras y/o caracteres en este campo.",
          })
        : "";

    req.errors = error;

    next();
};
