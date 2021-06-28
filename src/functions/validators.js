const { check } = require("express-validator")

module.exports = {

    register: [
        check("name")
            .trim()
            .notEmpty().withMessage("Debe ingresar un nombre").bail()
            .isLength({ min: 3 }).withMessage("El nombre debe tener minimo 3 caracteres"),
        check("password")
            .trim()
            .notEmpty().withMessage("Debe ingresar una contraseña").bail()
            .isAlphanumeric().withMessage(`La contraseña no puede tener los siguientes caracteres !?¡¿+´*""#$%&/()=`)
            .isLength({ min: 8 }).withMessage("La contraseña debe tener minimo 8 caracteres"),
    ],

    login: [
        check("name")
            .trim()
            .notEmpty().withMessage("Debe ingresar un nommbre de usuario").bail()
            .isLength({ min:3 }).withMessage("El nombre debe tener minimo 3 caracteres"),
        check("password")
            .notEmpty().withMessage("Debe ingresar una contraseña").bail()
            .isAlphanumeric().withMessage(`La contraseña no puede tener los siguientes caracteres !?¡¿+´*""#$%&/()=`)
            .isLength({ min:8 }).withMessage("La contraseña debe tener minimo 8 caracteres")
    ],

    changepassword: [
        check("password")
            .trim()
            .notEmpty().withMessage("Debe ingresar una contraseña").bail()
            .isAlphanumeric().withMessage(`La contraseña no puede tener los siguientes caracteres !?¡¿+´*""#$%&/()=`)
            .isLength({ min: 8 }).withMessage("La contraseña debe tener minimo 8 caracteres"),
        check("newpassword")
            .trim()
            .notEmpty().withMessage("Debe ingresar una nueva contraseña").bail()
            .isAlphanumeric().withMessage(`La contraseña no puede tener los siguientes caracteres !?¡¿+´*""#$%&/()=`)
            .isLength({ min: 8 }).withMessage("La contraseña debe tener minimo 8 caracteres"),
    ],

}