const functions = require("../functions/page");

module.exports = {

    getPage: (req, res) => {

        const pageData = functions.getPageData();

        res.json({
            meta: {
                status: 200
            },
            data: pageData[0]
        })
    },

    modifycanchayhorario: (req, res) => {

        if(req.body.cancha_amount){

            const amountToModify = Number(req.body.cancha_amount);

            const error = {
                error: false,
                message: ""
            };

            const data = [];
            const modifyCancha = functions.modifyCancha(amountToModify);

            if(modifyCancha.error){
                error.error = true;
                error.message = modifyCancha.message;
                data.push(modifyCancha.data)
            } else {
                data.push(modifyCancha)
            }

            res.json({
                meta: {
                    status: 200
                },
                error: error,
                data: data[0]
            })

        } else {

            const error = {
                error: false,
                message: ""
            };

            const data = [];
            const modifyHorario = functions.modifyHorario(req.body.accion, req.body.horarios);

            if(modifyHorario.error){
                error.error = true;
                error.message = modifyHorario.message;
                data.push(modifyHorario.data)
            } else {
                data.push(modifyHorario)
            }

            res.json({
                meta: {
                    status: 200
                },
                error: error,
                data: data[0]
            })
        }
    },

}