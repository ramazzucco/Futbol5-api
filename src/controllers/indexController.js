const fs = require("fs");
const path = require("path");
const pathpage = path.join(__dirname,"../database/dataproject.json");
const pathCanchaYhorario = path.join(__dirname,"../database/canchayhorario.json");
const functions = require("../functions/reserves");

module.exports = {

    index: (req, res) => {
        const dataPageJSON = fs.readFileSync(pathpage, {encoding: "utf-8"});
        const pageData = JSON.parse(dataPageJSON);
        const dataCanchaYhorarioJSON = fs.readFileSync(pathCanchaYhorario, {encoding: "utf-8"});
        const CanchaYhorarioData = JSON.parse(dataCanchaYhorarioJSON);

        const {dataPage, horarios} = functions.getDataPage(pageData,CanchaYhorarioData);

        const options = functions.getOptionsResponseForm("sendReserve");

        res.render("index.ejs", {dataPage,CanchaYhorarioData, horarios, options})

    }

}