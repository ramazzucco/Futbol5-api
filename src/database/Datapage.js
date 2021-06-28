const fs = require("fs");
const path = require("path");
const pathdatapage = path.join(__dirname, './datapage.json');

class Datapage{
    constructor(){
        this.data = JSON.parse(fs.readFileSync(pathdatapage, { encoding: 'utf-8' }));
    }

    getDataPage(){
        return this.data;
    }

    updateTextHome(value){
        this.data.page.section.home.text = value;

        fs.writeFileSync(pathdatapage, JSON.stringify(this.data,null,' '));

        let response;

        this.data.page.section.home.text !== value
            ? response = {
                error: true,
                field: 'text',
                message: 'No se pudo actualizar el texto.'
            }
            : response = this.data.page.section.home.text;


        return response
    }

    updatePromotion(object){
        this.data.page.section.promotions.data[object.id - 1] = object;

        fs.writeFileSync(pathdatapage, JSON.stringify(this.data,null,' '));

        let response = 0;

        if(this.data.page.section.promotions.data[object.id - 1].title !== object.title) response++
        if(this.data.page.section.promotions.data[object.id - 1].description !== object.description) response++

        Boolean(response)
            ? response = {
                error: true,
                field: 'text',
                message: 'No se pudo actualizar la promocion.'
            }
            : response = this.data.page.section.promotions.data;

        return response
    }

    updateFacilites(object){
        if(object.fields){ this.data.page.section.facilities.fields = object.fields; }
        if(object.changingrooms){ this.data.page.section.facilities.changingrooms = object.changingrooms; }
        if(object.grillsandbar){ this.data.page.section.facilities.grillsandbar = object.grillsandbar; }

        fs.writeFileSync(pathdatapage, JSON.stringify(this.data,null,' '));

        let response = '';

        if(object.fields){ this.data.page.section.facilities.fields !== object.fields ? response = 'fields' : ''; }
        if(object.changingrooms){ this.data.page.section.facilities.changingrooms !== object.changingrooms ? response = 'changingrooms' : ''; }
        if(object.grillsandbar){ this.data.page.section.facilities.grillsandbar !== object.grillsandbar ? response = 'grillsandbar' : ''; }

        response !== ''
            ? response = {
                error: true,
                field: response,
                message: `No se pudo actualizar el campo ${response}.`
            }
            : response = this.data.page.section.facilities;

        return response;
    }

    updateBirthdays(value){
        this.data.page.section.birthdays = value;

        fs.writeFileSync(pathdatapage, JSON.stringify(this.data,null,' '));

        let response;

        this.data.page.section.birthdays !== value
            ? response = {
                error: true,
                field: 'text',
                message: 'No se pudo actualizar el texto.'
            }
            : response = this.data.page.section.birthdays;

        return response
    }

    updateSchool(value){
        this.data.page.section.school = value;

        fs.writeFileSync(pathdatapage, JSON.stringify(this.data,null,' '));

        let response;

        this.data.page.section.school !== value
            ? response = {
                error: true,
                field: 'text',
                message: 'No se pudo actualizar el texto.'
            }
            : response = this.data.page.section.school;

        return response
    }

    updateSocialnetworks(object){
        this.data.page.footer.socialnetworks[object.id - 1].url = object.url;

        fs.writeFileSync(pathdatapage, JSON.stringify(this.data,null,' '));

        let response;

        this.data.page.footer.socialnetworks[object.id - 1].url !== object.url
            ? response = {
                error: true,
                field: 'text',
                message: `No se pudo actualizar la direccion de ${object.name}.`
            }
            : response = this.data.page.footer.socialnetworks;

        return response
    }

    updateContact(object){
        this.data.page.footer.contact[object.id - 1].data = object.data;

        fs.writeFileSync(pathdatapage, JSON.stringify(this.data,null,' '));

        let response;

        this.data.page.footer.contact[object.id - 1].data !== object.data
            ? response = {
                error: true,
                field: 'text',
                message: `${object.title} no se pudo actualizar.`
            }
            : response = this.data.page.footer.contact;

        return response
    }

    updateImages(image){
        const url = process.env.NODE_ENV !== 'development' ?
            `${process.env.URL_API_DEV}/images/${image.path}/${image.filename}` : `${process.env.URL_API_PROD}/images/${image.path}/${image.filename}`
        let oldimage; // Para eliminar la imagen anterior.

        // Escribo la nueva imagen en la base de datos.
        switch (image.path) {
            case 'sponsors':
                oldimage = this.data.page.section.home.sponsors[Number(image.id) - 1].image;

                this.data.page.section.home.sponsors[Number(image.id) - 1].image = image.filename;
                this.data.page.section.home.sponsors[Number(image.id) - 1].url = url;
                break;
            case 'facilities':
                oldimage = this.data.page.section.facilities.images[Number(image.id) - 1].name;

                this.data.page.section.facilities.images[Number(image.id) - 1].name = image.filename;
                this.data.page.section.facilities.images[Number(image.id) - 1].url = url;
            case 'birthdays':
                oldimage = this.data.page.section.birthdaysImage[Number(image.id) - 1].name;

                this.data.page.section.birthdaysImage[Number(image.id) - 1].name = image.filename;
                this.data.page.section.birthdaysImage[Number(image.id) - 1].url = url;
            case 'school':
                oldimage = this.data.page.section.schoolImage[Number(image.id) - 1].name;

                this.data.page.section.schoolImage[Number(image.id) - 1].name = image.filename;
                this.data.page.section.schoolImage[Number(image.id) - 1].url = url;
            default:
                break;
        }

        fs.writeFileSync(pathdatapage, JSON.stringify(this.data,null,' '));

        const response = [];

        // Respuesta.
        switch (image.path) {
            case 'sponsors':
                this.data.page.section.home.sponsors[Number(image.id) - 1].image !== image.filename
                    ? response.push({
                        error: true,
                        field: image.field,
                        image: image.image,
                        message: 'No se pudo actualizar la imagen.'
                    })
                    : response.push(...this.data.page.section.home.sponsors);
                break;
            case 'facilities':
                this.data.page.section.facilities.images[Number(image.id) - 1].name !== image.filename
                    ? response.push({
                        error: true,
                        field: image.field,
                        image: image.image,
                        message: 'No se pudo actualizar la imagen.'
                    })
                    : response.push(...this.data.page.section.facilities.images);
                break;
            case 'birthdays':
                this.data.page.section.birthdaysImage[Number(image.id) - 1].name !== image.filename
                    ? response.push({
                        error: true,
                        field: image.field,
                        image: image.image,
                        message: 'No se pudo actualizar la imagen.'
                    })
                    : response.push(...this.data.page.section.birthdaysImage);
                break;
            case 'school':
                this.data.page.section.schoolImage[Number(image.id) - 1].name !== image.filename
                    ? response.push({
                        error: true,
                        field: image.field,
                        image: image.image,
                        message: 'No se pudo actualizar la imagen.'
                    })
                    : response.push(...this.data.page.section.schoolImage);
                break;
            default:
                break;
        }

        // Borro la imagen anterior del servidor.
        if(response[0].error === undefined){
            if(oldimage !== 'sin_imagen.jpg'){
                fs.unlinkSync(path.join(__dirname,`../../public/images/${image.path}/${oldimage}`));
            }
        }

        return response
    }


}

module.exports = { Datapage };