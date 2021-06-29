const fs = require("fs");
const path = require("path");
const pathreserves = path.join(__dirname, './reserves.json');
const pathistory = path.join(__dirname, './history.json');

class Reserve {

    constructor(){
        this.reserves = JSON.parse(fs.readFileSync(pathreserves, { encoding: 'utf-8' }));
        this.history = JSON.parse(fs.readFileSync(pathistory, { encoding: 'utf-8' }));
        this.field = {
            number: this.reserves.length + 1,
            status: "incomplete",
            total: 0,
            options: this.reserves[0].options.map((option,i) => {
                return {
                    shedule: `${i + 15}:00`,
                    reserved: false,
                    field: this.reserves.length + 1,
                    reserve_id: '',
                    name: '',
                    phone: '',
                    time: '',
                    incomming: false
                }
            })
        }
        this.reserveshedules = this.reserves[0].options.map( option => option.shedule);
    }

    getReserves(){
        return this.reserves;
    }

    getHistory(){
        return this.history;
    }

    create(newreserve){

        let response;
        const date = new Date();
        const hours = date.getUTCHours();
        const sheduletoreserve = parseInt(newreserve.shedule.slice(0,3));

        console.log(hours,' - ',sheduletoreserve)
        if(hours > sheduletoreserve){
            return {
                error: true,
                message: 'Es tarde para reservar ese horario.'
            }
        }else{
            const idnewreserve = this.history[this.history.length - 1].id + 1;
            const hours = date.getUTCHours();
            const minutes = date.getUTCMinutes();
            const seconds = date.getUTCSeconds();

            const time = `${hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}`: seconds}`;

            this.reserves[Number(newreserve.field) - 1].total++;

            this.reserves[Number(newreserve.field) - 1].options.forEach( reserve => {
                if(reserve.field === Number(newreserve.field) && reserve.shedule === newreserve.shedule){
                    reserve.reserved = true;
                    reserve.reserve_id = idnewreserve;
                    reserve.name = `${newreserve.name} ${newreserve.lastname}`;
                    reserve.phone = `${newreserve.phone.slice(0,3)}-${newreserve.phone.slice(3,9)}`
                    reserve.time = time;
                    reserve.incomming = true;
                }
            });

            fs.writeFileSync(pathreserves,JSON.stringify(this.reserves,null,' '));

            const newdate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

            const createreserve = {
                id: idnewreserve,
                field: Number(newreserve.field),
                shedule: newreserve.shedule,
                name: newreserve.name,
                lastname: newreserve.lastname,
                email: newreserve.email ? newreserve.email : '',
                phone: `${newreserve.phone.slice(0,3)}-${newreserve.phone.slice(3,9)}`,
                date: newdate
            }

            this.history.push(createreserve);

            const shedule = this.reserves[Number(newreserve.field) - 1].options.find( option => option.shedule === newreserve.shedule);

            shedule.reserved
                ? response = {
                    reserves: this.reserves,
                    newreserve: newreserve
                }
                : response = {
                    error: true,
                    message: 'No se ha podido crear la reserva!'
                }

            fs.writeFileSync(pathistory,JSON.stringify(this.history,null,' '));

            return response;
        }


    }

    checked(reserve){
        this.reserves[reserve.field].options[reserve.index].incomming = false;

        fs.writeFileSync(pathreserves,JSON.stringify(this.reserves,null,' '));

        return this.reserves;
    }

    cancel(reservetocancel){
        this.reserves[reservetocancel.field - 1].options.forEach( reserve => {
            if(reserve.field === reservetocancel.field && reserve.shedule === reservetocancel.shedule){
                reserve.reserved = false;
                reserve.reserve_id = '';
            }
        });

        fs.writeFileSync(pathreserves,JSON.stringify(this.reserves,null,' '));

        this.history.forEach( reserve => {
            if(reserve.id === reservetocancel.id){
                reserve.status = 'Cancelado';
            }
        });

        fs.writeFileSync(pathistory,JSON.stringify(this.history,null,' '));

        return this.reserves;
    }

    deleteHistory(ids){

        ids.forEach( async id => {

            await this.history.map( (reserve,i) => {

                if(reserve.id === id) this.history.splice(i, 1);

            })

        });

        fs.writeFileSync(pathistory,JSON.stringify(this.history,null,' '));

        return ids;
    }

    reset(){
        this.reserves.forEach( async field => {
            await field.options.forEach( reserve => {
                reserve.reserved = false;
                reserve.reserve_id = '';
                reserve.name = '';
                reserve.phone = '';
                reserve.time = '';
            })
        })

        fs.writeFileSync(pathreserves,JSON.stringify(this.reserves,null,' '));

        let response = 0;

        this.reserves.forEach( async field => {
            await field.options.forEach( reserve => {
                if(reserve.reserved){
                    response++
                }
            })
        })

        Boolean(response)
            ? response = {
                error: true,
                message: 'No se pudieron resetear las reservas del dia.'
            }
            : response = this.reserves;

        return response;
    }

    fields(fields){
        const numberfieldstomodify = Number(fields.number) - this.reserves.length;

        if(numberfieldstomodify > 0){
            for (let index = 0; index < numberfieldstomodify; index++) {
                this.reserves = [
                    ...this.reserves,
                    this.field
                ]
            }
        }else{
            this.reserves.length = this.reserves.length + numberfieldstomodify;
        }

        fs.writeFileSync(pathreserves,JSON.stringify(this.reserves,null,' '));

        return this.reserves;
    }

    shedules(data){
        const sortShedules = (a,b) => {
            if (a.shedule > b.shedule) {
                return 1;
            }
            if (a.shedule < b.shedule) {
                return -1;
            }
            return 0;
        }

        this.reserves.map( async field => {

            await data.shedules.map( shedule => {

                if(!this.reserveshedules.includes(shedule)){
                    field.options.push({
                        shedule: shedule,
                        reserved: false,
                        field: field.number,
                        reserve_id: '',
                        name: '',
                        phone: '',
                        time: '',
                        incomming: false
                    })
                }else{
                    field.options = field.options.filter( option => option.shedule !== shedule);
                }

            });

        })

        this.reserves.map( field => {
            field.options.sort((a, b) => sortShedules(a, b));
        })

        fs.writeFileSync(pathreserves,JSON.stringify(this.reserves,null,' '));

        return this.reserves;
    }
}

module.exports = { Reserve };