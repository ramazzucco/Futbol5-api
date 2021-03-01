const fs = require("fs");
const path = require("path");
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

        const dataPageJSON = fs.readFileSync(pathpage, {encoding: "utf-8"});
        const pageData = JSON.parse(dataPageJSON);

        const response = [];

        if(amountToModify < 0){

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

        if(action == "agregar"){

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

    modifySection: (data, files) => {
        const dataPageJSON = fs.readFileSync(pathpage, {encoding: "utf-8"});
        const pageData = JSON.parse(dataPageJSON);

        const response = [];

        switch (data.section) {
            case "home":
                if(data.text){
                    pageData.page.section.home.text = data.text
                }

                if(files && !files[0].error){
                    files.map( image => {
                        pageData.page.section.home.sponsors.map( (sponsor, i) => {
                            const urlApi = process.env.USERDOMAIN ===  'DESKTOP-O3O462B'
                                ? `${process.env.URL_API_DEV}`
                                : `${process.env.URL_API_PROD}`
                            if(image.fieldname === sponsor.name){
                                const url = urlApi + "/images/" + image.filename;
                                console.log("URL de la nueva imagen de auspiciante: ",url)
                                console.log("url a eliminar: ",path.join(__dirname,"../../public/images/" + sponsor.image))
                                fs.unlinkSync(path.join(__dirname,"../../public/images/" + sponsor.image));
                                pageData.page.section.home.sponsors[i].image = image.filename;
                                pageData.page.section.home.sponsors[i].url = url;
                            }

                        })
                    })
                } else {
                    response.push(files)
                }

                fs.writeFileSync(pathpage,JSON.stringify(pageData,null," "));

                const dataHomeJSON = fs.readFileSync(pathpage, {encoding: "utf-8"});
                const dataHome = JSON.parse(dataHomeJSON);

                response.push(dataHome);
                break;
            case "instalaciones":
                if(data.canchas){
                    pageData.page.section.instalaciones.canchas = data.canchas;
                }
                if (data.vestuarios){
                    pageData.page.section.instalaciones.vesturarios = `${data.vestuarios}`;
                }
                if(data.parrillasybar){
                    pageData.page.section.instalaciones.parrillasybar = `${data.parrillasybar}`;
                }

                fs.writeFileSync(pathpage,JSON.stringify(pageData,null," "));

                const dataInstalacionesJSON = fs.readFileSync(pathpage, {encoding: "utf-8"});
                const dataInstalaciones = JSON.parse(dataInstalacionesJSON);

                response.push(dataInstalaciones);
                break;
            case "cumpleaños":
                if(data.cumpleaños){
                    pageData.page.section.cumpleaños = data.cumpleaños
                }

                fs.writeFileSync(pathpage,JSON.stringify(pageData,null," "));

                const dataCumpleañosJSON = fs.readFileSync(pathpage, {encoding: "utf-8"});
                const dataCumpleaños = JSON.parse(dataCumpleañosJSON);

                response.push(dataCumpleaños);
                break;
            case "escuelita":
                if(data.escuelita){
                    pageData.page.section.escuelita = data.escuelita
                }

                fs.writeFileSync(pathpage,JSON.stringify(pageData,null," "));

                const dataEscuelitaJSON = fs.readFileSync(pathpage, {encoding: "utf-8"});
                const dataEscuelita = JSON.parse(dataEscuelitaJSON);

                response.push(dataEscuelita);
                break;
            case "promociones":
                const promotions = pageData.page.section.promociones.datos;

                if(promotions.length == 0){
                    data.promos.map( promo => {
                        pageData.page.section.promociones.datos.push(promo);
                    })
                }

                if(promotions.length > 0){
                    data.promos.map( promo => {
                        if(promo.numero){
                            pageData.page.section.promociones.datos[promo.numero - 1].titulo = promo.titulo
                        } else {
                            const findpromo = pageData.page.section.promociones.datos.find( p => p.titulo == promo.titulo )
                            console.log(findpromo)
                            pageData.page.section.promociones.datos[findpromo.numero - 1].descripcion = promo.descripcion;
                        }
                    })
                }

                fs.writeFileSync(pathpage,JSON.stringify(pageData,null," "));

                const dataPromocionesJSON = fs.readFileSync(pathpage, {encoding: "utf-8"});
                const dataPromociones = JSON.parse(dataPromocionesJSON);

                response.push(dataPromociones);
                break;
            default:
                break;
        }

        return response.length >= 2 ? response : response[0];
    },

    modifyFooter: (data) => {
        const dataPageJSON = fs.readFileSync(pathpage, {encoding: "utf-8"});
        const pageData = JSON.parse(dataPageJSON);

        const response = [];

        if(data.section == "redes sociales"){
            data.redessociales.map( (redes, i) => {
                pageData.page.footer.redessociales.map( redesDB => {
                    if(redes.titulo == redesDB.nombre){
                        pageData.page.footer.redessociales[i].nombre = redes.titulo;
                        pageData.page.footer.redessociales[i].url = redes.url;
                    }
                })
            })

            fs.writeFileSync(pathpage,JSON.stringify(pageData,null," "));

            const dataRedesJSON = fs.readFileSync(pathpage, {encoding: "utf-8"});
            const dataRedes = JSON.parse(dataRedesJSON);

            response.push(dataRedes);
        }

        if(data.section == "contacto"){

            if(data.direccion){
                pageData.page.footer.contacto[0].data = data.direccion;
            }

            if(data.telefono){
                pageData.page.footer.contacto[1].data = data.telefono;
            }

            if(data.whatsapp){
                pageData.page.footer.contacto[2].data = data.whatsapp;
            }

            if(data.email){
                pageData.page.footer.contacto[3].data = data.email;
            }

            fs.writeFileSync(pathpage,JSON.stringify(pageData,null," "));

            const dataContactoJSON = fs.readFileSync(pathpage, {encoding: "utf-8"});
            const dataContacto = JSON.parse(dataContactoJSON);

            response.push(dataContacto);
        }

        return response[0];
    },
}