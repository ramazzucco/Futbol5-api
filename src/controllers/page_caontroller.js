const { Datapage } = require('../database/Datapage');
const { Reserve } = require('../database/Reserve');
const reserve = new Reserve();
const data = new Datapage();

module.exports = {

    index: (req, res) => {
        const reserves = reserve.getReserves();
        const {page, shedules} = data.getDataPage();

        res.json({
            meta: {
                status: 200
            },
            reserves: reserves,
            page: page,
            shedules: shedules
        })
    },

    updateText: (req, res) => {
        let response;

        switch (req.params.section) {
            case 'home':
                response = data.updateTextHome(req.body.text);
                break;
            case 'facilities':
                response = data.updateFacilites(req.body.facilities);
                break;
            case 'birthdays':
                response = data.updateBirthdays(req.body.birthdays);
                break;
            case 'school':
                response = data.updateSchool(req.body.school);
                break;
            case 'promotions':
                response = data.updatePromotion(req.body.promo);
                break;
            case 'socialnetworks':
                response = data.updateSocialnetworks(req.body.socialnetworks);
                break;
            case 'contact':
                response = data.updateContact(req.body.contact);
                break;
            default:
                response = {
                    error: true,
                    field: 'text',
                    message: 'El parametro de la ruta no es correcto'
                }
                break;
        }

        if(response.error){
            return res.json({
                meta: {
                    status: 400
                },
                error: true,
                data: response
            })
        }else{
            return res.json({
                meta: {
                    status: 200
                },
                data: response
            })
        }
    },

    updateImages: (req, res) => {
        console.log('controller: ',req.file)
        if(req.file.error){

            return res.json({
                meta: {
                    status: 400
                },
                error: true,
                data: [req.file]
            })

        }else{
            req.body.filename = req.file.filename;

            const updateimage = data.updateImages(req.body);

            if(updateimage.error){
                return res.json({
                    meta: {
                        status: 400
                    },
                    error: true,
                    data: updateimage
                })
            }else{
                return res.json({
                    meta: {
                        status: 200
                    },
                    data: updateimage
                })
            }
        }
    }

}