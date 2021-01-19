const numeros="0123456789-!#$%&/()=?¡¿'|°";

function hasNumber(variable){
    for(i=0; i<variable.length; i++){
        if (numeros.indexOf(variable.charAt(i),0)!=-1){
            return true;
        }
    }
    return false;
}

module.exports = (req, res, next) =>  {
    const error = [];
    const myKey = process.env.MY_PASS;

    // -----------Validacion del campo nombre.
    req.body.name == "" ? error.push({ field: "name", message: "Campo obligatorio." }) : "";

    const name = req.body.name.trim();
    const namehasnumber = hasNumber(name);
    namehasnumber ? error.push({field: "name", message: "No se puede introducir numeros en este campo."}) : ""
    name != "" && name.length < 3 ? error.push({field: "name", message: "Minimo 3 caracteres."}) : ""
    name != "" && name.length > 15 ? error.push({field: "name", message: "Maximo 15 caracteres."}) : ""

    // -----------Validacion del campo apellido.
    const lastname = req.body.lastname.trim();
    const lastnamehasnumber = hasNumber(lastname);

    lastnamehasnumber ? error.push({field: "lastname", message: "No se puede introducir numeros y/o caracteres en este campo."}) : ""
    lastname != "" && lastname.length < 3 ? error.push({field: "lastname", message: "Minimo 3 caracteres."}) : ""
    lastname != "" && lastname.length > 20 ? error.push({field: "lastname", message: "Maximo 20 caracteres."}) : ""

    // -----------Validacion del campo email.
    const email = req.body.email ? req.body.email.trim() : "";
    const isemail = email.indexOf("@");

    email != "" && isemail == -1 ? error.push({ field: "email", message: "Email invalido"}) : ""

    // -----------Validacion del campo password.
    const password = req.body.password.trim();

    password == "" ? error.push({field: "password", message: "Campo obligatorio"}) : ""
    password.length < 8 || password.length > 15 ? error.push({field: "password", message: "Minimo 8 caracteres, Maximo 15 caracteres"}) : ""

    // -----------Validacion del campo key.
    const key = req.body.key.trim();

    key == "" ? error.push({field: "key", message: "Campo obligatorio"}) : ""
    key != myKey ? error.push({field: "key", message: "Key Incorrecta"}) : ""

    error.length ? req.errors = error : ""
    next();
};