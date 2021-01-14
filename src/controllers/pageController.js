const fs = require("fs");
const path = require("path");
const pathpage = path.join(__dirname,"../database/dataproject.json");
const dataPageJSON = fs.readFileSync(pathpage, {encoding: "utf-8"});
const pageData = JSON.parse(dataPageJSON);
const pathCanchaYhorario = path.join(__dirname,"../database/canchayhorario.json");
const dataCanchaYhorarioJSON = fs.readFileSync(pathCanchaYhorario, {encoding: "utf-8"});
const CanchaYhorarioData = JSON.parse(dataCanchaYhorarioJSON);

module.exports = {

    getPage: (req, res) => {
        res.json({
            meta: {
                status: 200
            },
            data: pageData
        })
    },

    modifycanchayhorario: async (req, res) => {

        if(req.body.cancha_amount){
            const amountToModify = Number(req.body.cancha_amount);

            if(amountToModify < 0){
                const dif = CanchaYhorarioData.length + amountToModify;

                CanchaYhorarioData.length = dif;
                pageData.canchas.cantidad = dif;

                await fs.writeFileSync(pathCanchaYhorario, JSON.stringify(CanchaYhorarioData,null," "));
                await fs.writeFileSync(pathpage, JSON.stringify(pageData,null," "));

            }

            if(amountToModify > 0){

                for(let i=0; i < amountToModify; i++){
                    const lastNumberOfCancha = CanchaYhorarioData[CanchaYhorarioData.length - 1].number;
                    const newCancha = pageData.canchas.model;

                    newCancha.number = lastNumberOfCancha + 1;
                    newCancha.options.map( option => {
                        option.cancha = lastNumberOfCancha + 1
                    });

                    CanchaYhorarioData.push(newCancha);
                    pageData.canchas.cantidad = lastNumberOfCancha + 1;

                    await fs.writeFileSync(pathCanchaYhorario, JSON.stringify(CanchaYhorarioData,null," "));
                    await fs.writeFileSync(pathpage, JSON.stringify(pageData,null," "));
                }

            }

            res.json({
                meta: {
                    status: 200
                },
                data: pageData
            })

        } else {

            if(req.body.accion == "Agregar"){

                const horarioToAdd = parseInt(req.body.horarios.slice(0,3));
                const firstHorario = parseInt(pageData.horarios[0].slice(0,3));

                for(let i=0; i < CanchaYhorarioData.length; i++){
                    const newHorario =  {
                        horario: req.body.horarios,
                        reservado: false,
                        cancha: i + 1,
                        reserve_id: ""
                    };

                    horarioToAdd < firstHorario
                        ? CanchaYhorarioData[i].options.unshift(newHorario)
                        : CanchaYhorarioData[i].options.push(newHorario);

                }

                const newHorarioModel = {
                    horario: req.body.horarios,
                    reservado: false,
                    cancha: "",
                    reserve_id: ""
                }

                horarioToAdd < firstHorario
                    ? pageData.canchas.model.options.unshift(newHorarioModel)
                    : pageData.canchas.model.options.push(newHorarioModel)

                horarioToAdd < firstHorario
                    ? pageData.horarios.unshift(req.body.horarios)
                    : pageData.horarios.push(req.body.horarios);

                await fs.writeFileSync(pathCanchaYhorario,JSON.stringify(CanchaYhorarioData,null," "));
                await fs.writeFileSync(pathpage,JSON.stringify(pageData,null," "));

            } else {
                const horarioToRemove = req.body.horarios;
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

                await fs.writeFileSync(pathCanchaYhorario,JSON.stringify(CanchaYhorarioData,null," "));
                await fs.writeFileSync(pathpage,JSON.stringify(pageData,null," "));

            }
        }

        res.json({
            meta: {
                status: 200
            },
            data: pageData
        })
    }


}