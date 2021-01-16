const fs = require("fs");
const path = require("path");
const { options } = require("../app");

const pathpage = path.join(__dirname,"../database/dataproject.json");
const pathCanchaYhorario = path.join(__dirname,"../database/canchayhorario.json");

module.exports = {

    getPageData: () => {
        const dataPageJSON = fs.readFileSync(pathpage, {encoding: "utf-8"});
        const pageData = JSON.parse(dataPageJSON);

        const response = [];

        pageData
            ? response.push(pageData)
            : response.push({error: true, message: "Data not found, check your conexion!"});

        return response;
    },

    modifyCancha: (amountToModify) => {

        const response = [];

        if(amountToModify < 0){
            const dataPageJSON = fs.readFileSync(pathpage, {encoding: "utf-8"});
            const pageData = JSON.parse(dataPageJSON);
            const dataCanchaYhorarioJSON = fs.readFileSync(pathCanchaYhorario, {encoding: "utf-8"});
            const CanchaYhorarioData = JSON.parse(dataCanchaYhorarioJSON);

            const amountOfcanchasBefore = CanchaYhorarioData.length;
            const amountOfcanchasToModify = CanchaYhorarioData.length + amountToModify;

            CanchaYhorarioData.length = amountOfcanchasToModify;
            pageData.canchas.cantidad = amountOfcanchasToModify;

            fs.writeFileSync(pathCanchaYhorario, JSON.stringify(CanchaYhorarioData,null," "));
            fs.writeFileSync(pathpage, JSON.stringify(pageData,null," "));

            const newdataPageJSON = fs.readFileSync(pathpage, {encoding: "utf-8"});
            const newpageData = JSON.parse(newdataPageJSON);
            const newdataCanchaYhorarioJSON = fs.readFileSync(pathCanchaYhorario, {encoding: "utf-8"});
            const newCanchaYhorarioData = JSON.parse(newdataCanchaYhorarioJSON);

            newCanchaYhorarioData.length == amountOfcanchasBefore
                ? response.push({error: true, message: "The cancha could not be remove!", data: newpageData})
                : response.push(newpageData);

        }

        if(amountToModify > 0){

            for(let i=0; i < amountToModify; i++){
                const dataPageJSON = fs.readFileSync(pathpage, {encoding: "utf-8"});
                const pageData = JSON.parse(dataPageJSON);
                const dataCanchaYhorarioJSON = fs.readFileSync(pathCanchaYhorario, {encoding: "utf-8"});
                const CanchaYhorarioData = JSON.parse(dataCanchaYhorarioJSON);

                const amountOfcanchasBefore = CanchaYhorarioData.length;
                const lastNumberOfCancha = CanchaYhorarioData[CanchaYhorarioData.length - 1].number;
                const newCancha = pageData.canchas.model;

                newCancha.number = lastNumberOfCancha + 1;
                newCancha.options.map( option => {
                    option.cancha = lastNumberOfCancha + 1
                });

                CanchaYhorarioData.push(newCancha);
                pageData.canchas.cantidad = lastNumberOfCancha + 1;

                fs.writeFileSync(pathCanchaYhorario, JSON.stringify(CanchaYhorarioData,null," "));
                fs.writeFileSync(pathpage, JSON.stringify(pageData,null," "));

                const newdataPageJSON = fs.readFileSync(pathpage, {encoding: "utf-8"});
                const newpageData = JSON.parse(newdataPageJSON);
                const newdataCanchaYhorarioJSON = fs.readFileSync(pathCanchaYhorario, {encoding: "utf-8"});
                const newCanchaYhorarioData = JSON.parse(newdataCanchaYhorarioJSON);

                newCanchaYhorarioData.length == amountOfcanchasBefore
                    ? response.push({error: true, message: "The cancha could not be added!",data: newpageData})
                    : response.push(newpageData);
                }

        }

        return response[0];
    },

    modifyHorario: (action,horario) => {

        const response = [];

        if(action == "Agregar"){

            const dataPageJSON = fs.readFileSync(pathpage, {encoding: "utf-8"});
            const pageData = JSON.parse(dataPageJSON);
            const dataCanchaYhorarioJSON = fs.readFileSync(pathCanchaYhorario, {encoding: "utf-8"});
            const CanchaYhorarioData = JSON.parse(dataCanchaYhorarioJSON);

            const horarioToAdd = parseInt(horario.slice(0,3));
            const firstHorario = parseInt(pageData.horarios[0].slice(0,3));

            for(let i=0; i < CanchaYhorarioData.length; i++){
                const newHorario = {
                    horario: horario,
                    reservado: false,
                    cancha: i + 1,
                    reserve_id: ""
                };

                horarioToAdd < firstHorario
                    ? CanchaYhorarioData[i].options.unshift(newHorario)
                    : CanchaYhorarioData[i].options.push(newHorario);

            }

            const newHorarioModel = {
                horario: horario,
                reservado: false,
                cancha: "",
                reserve_id: ""
            }

            horarioToAdd < firstHorario
                ? pageData.canchas.model.options.unshift(newHorarioModel)
                : pageData.canchas.model.options.push(newHorarioModel)

            horarioToAdd < firstHorario
                ? pageData.horarios.unshift(horario)
                : pageData.horarios.push(horario);

            fs.writeFileSync(pathCanchaYhorario,JSON.stringify(CanchaYhorarioData,null," "));
            fs.writeFileSync(pathpage,JSON.stringify(pageData,null," "));

            // Verification.
            const newdataPageJSON = fs.readFileSync(pathpage, {encoding: "utf-8"});
            const newpageData = JSON.parse(newdataPageJSON);
            const newdataCanchaYhorarioJSON = fs.readFileSync(pathCanchaYhorario, {encoding: "utf-8"});
            const newCanchaYhorarioData = JSON.parse(newdataCanchaYhorarioJSON);

            const newHorarioFind = newCanchaYhorarioData[newCanchaYhorarioData.length - 1].options.indexOf(horario);

            newHorarioFind != -1
                ? response.push({error: true, message: "The new horario could not be added!",data: newpageData})
                : response.push(newpageData);

        } else {
            const dataPageJSON = fs.readFileSync(pathpage, {encoding: "utf-8"});
            const pageData = JSON.parse(dataPageJSON);
            const dataCanchaYhorarioJSON = fs.readFileSync(pathCanchaYhorario, {encoding: "utf-8"});
            const CanchaYhorarioData = JSON.parse(dataCanchaYhorarioJSON);

            const horarioToRemove = horario;
            const positionOfHorarioToRemove = pageData.horarios.indexOf(horarioToRemove);

            positionOfHorarioToRemove == 0
                ? pageData.horarios.shift(positionOfHorarioToRemove)
                : pageData.horarios.pop(positionOfHorarioToRemove)

            positionOfHorarioToRemove == 0
                ? pageData.canchas.model.options.shift(positionOfHorarioToRemove)
                : pageData.canchas.model.options.pop(positionOfHorarioToRemove)

            for(cancha of CanchaYhorarioData){
                positionOfHorarioToRemove == 0
                    ? cancha.options.shift(positionOfHorarioToRemove)
                    : cancha.options.pop(positionOfHorarioToRemove)
            }

            fs.writeFileSync(pathCanchaYhorario,JSON.stringify(CanchaYhorarioData,null," "));
            fs.writeFileSync(pathpage,JSON.stringify(pageData,null," "));

            //Verification.
            const newdataPageJSON = fs.readFileSync(pathpage, {encoding: "utf-8"});
            const newpageData = JSON.parse(newdataPageJSON);
            const newdataCanchaYhorarioJSON = fs.readFileSync(pathCanchaYhorario, {encoding: "utf-8"});
            const newCanchaYhorarioData = JSON.parse(newdataCanchaYhorarioJSON);

            const newHorarioFind = newCanchaYhorarioData[newCanchaYhorarioData.length - 1].options.indexOf(horario);
            console.log("newhorariofind: ",newHorarioFind)

            newHorarioFind == -1
                ? response.push(newpageData)
                : response.push({error: true, message: "The new horario could not be deleted!", data: newpageData})


        }

        return response[0];
    },

}