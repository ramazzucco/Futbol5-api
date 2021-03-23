const functions = require("../functions/page");
const mainfunctions = require("../functions/main");

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
                error: error.error,
                data: data[0]
            })
        }
    },

    getSponsors: (req, res) => {

        res.send("/public/images/sin_imagen.jpg")

    },

    modifyLinks: (req, res) => {

        const pageData = functions.getPageData();
        const action = req.body.accion;
        const linkToModify = req.body.link.toLowerCase();
        const response = {
            error: "",
            data: {}
        }

        if(action == "agregar"){
            pageData[0].page.header.links.push(req.body.link);
        }

        if(action == "quitar"){
            const positonLinkOnArray = pageData[0].page.header.links.indexOf(linkToModify);

            pageData[0].page.header.links.splice(positonLinkOnArray,1);
        }

        const savedData = mainfunctions.saveDataProject(pageData[0]);

        response.error = false;
        response.data = savedData;

        res.json({
            meta:{
                status: 200
            },
            error: response.error,
            data: response.data
        })
    },

    modifySection: (req, res) => {

        const response = {
            error: false,
            status: "",
            data: {}
        }

        console.log("page controller: ",req.files)

        const files = req.file ? req.file : req.files;
        const dataSaved = functions.modifySection(req.body, files);

        if(dataSaved){

            if(dataSaved.length >= 2){
                response.error = true;
                response.status = 300;
                response.data.error = dataSaved[0];
                response.data.data = dataSaved[1];
            } else {
                response.status = 200;
                response.data = dataSaved;
            }
        } else {
            res.send("Data could not be saved, please check your conection to ethernet!")
            // response.data = {
            //     error: true,
            //     message: "Data could not be saved, please check your conection to ethernet!"
            // }
        }

        res.json({
            meta: {
                status: response.status
            },
            error: response.error,
            data: response.data
        })
    },

    modifyFooter: (req, res) => {

        const response = {
            error: false,
            status: "",
            data: {}
        }

        const dataSaved = functions.modifyFooter(req.body);

        if(dataSaved){
            response.status = 200;
            response.data = dataSaved;
        } else {
            response.error = true;
            response.status = 404;
            response.data = {
                error: true,
                message: "Data could not be saved, please check your conection to ethernet!"
            }
        }

        res.json({
            meta: {
                status: response.status
            },
            error: response.error,
            data: response.data
        })

    }
}