let db = require("../database/models");

let admin = false;

module.exports = {

    getEnviroment: () => {
        const enviroment = process.env.USERDOMAIN == 'DESKTOP-O3O462B' ? "development" : "production";
        return enviroment;
    },

    getUrlApiAdminProd: () => {
        const urlApiProd = "https://api-futbol5.herokuapp.com/";
        return urlApiProd;
    },

    getUrlApiAdminDev: () => {
        const urlApiDev ="http://localhost:3000/";
        return urlApiDev;
    },

    getUrlAppAdminProd: () => {
        const urlAppProd = "https://futbol5-app.herokuapp.com";
        return urlAppProd;
    },

    getUrlAppAdminDev: () => {
        const urlAppDev = "http://localhost:5000/admin";
        return urlAppDev;
    },

    setSession: (data) => {
        admin = data
    },

    getSession: () => {
        return admin;
    }

}