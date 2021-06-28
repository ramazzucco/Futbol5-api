const { check } = require("express-validator");

module.exports = {
    reserve: [
        check("field")
            .trim()
            .notEmpty().withMessage("Debe seleccionar una cancha").bail(),
        check("shedule")
            .trim()
            .notEmpty().withMessage("Debe ingresar un horario").bail(),
        check("name")
            .trim()
            .notEmpty().withMessage("Debe ingresar un nombre").bail()
            .isLength({ min: 3, max: 15 }).withMessage("Minimo 3 y maximo 15 caracteres")
            .isAlpha().withMessage('No puede ingresar numeros ni caracteres en este campo'),
        check("lastname")
            .trim()
            .notEmpty().withMessage("Debe ingresar un precio").bail()
            .isLength({ min: 3, max: 15 }).withMessage("Minimo 3 y maximo 15 caracteres")
            .isAlpha().withMessage('No puede ingresar numeros ni caracteres en este campo'),
        check("email")
            .trim()
            .isEmail().withMessage("Debe ingresar un formato de email válido"),
        check("phone")
            .trim()
            .isLength(9).withMessage('El numero de telefono debe tener 9 digitos')
            .isNumeric().withMessage('Debe ingresar numeros en este campo')
            .notEmpty().withMessage("Debe ingresar un numero telefonico ej: 155-999666").bail(),
    ]
}
