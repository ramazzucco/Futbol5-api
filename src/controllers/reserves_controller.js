const { validationResult } = require("express-validator");
const { Reserve } = require('../database/Reserve');
const reserve = new Reserve();

module.exports = {
    reserves: (req, res) => {
        const reserves = reserve.getReserves();

        if(reserves){
            return res.json({
                meta: {
                    status: 200
                },
                data: reserves
            })
        }else{
            return res.json({
                meta: {
                    status: 400
                },
                error: true,
                message: 'Lo sentimos no se ha podido cargar las reservas'
            })
        }
    },

    history: (req, res) => {
        const history = reserve.getHistory();

        if(history){
            return res.json({
                meta: {
                    status: 200
                },
                data: history
            })
        }else{
            return res.json({
                meta: {
                    status: 400
                },
                error: true,
                message: 'Lo sentimos no se ha podido cargar el historial de reservas'
            })
        }
    },

    create: (req, res) => {
        const errors = validationResult(req).errors.filter( error => error.param !== 'email');

        console.log(errors)
        if(errors.length){
            return res.json({
                meta: {
                    status: 400
                },
                error: true,
                errorform: true,
                data: errors
            })
        }

        const newreserve = reserve.create(req.body);

        console.log(newreserve)
        if(!newreserve.error){
            return res.json({
                meta: {
                    status:200
                },
                newreserve: newreserve.newreserve,
                reserves: newreserve.reserves
            })
        }else{
            return res.json({
                meta: {
                    status: 400
                },
                error: true,
                errorreserve: true,
                message: newreserve.message
            })
        }
    },

    checked: (req, res) => {
        const checked = reserve.checked(req.body.reserve);

        res.json({
            meta: {
                status: 200
            },
            data: checked
        })
    },

    cancel: (req,res) => {
        const reservecanceled = reserve.cancel(req.body.reserve);

        return res.json({
            meta: {
                status: 200
            },
            history: reservecanceled,
        })
    },

    delete: (req, res) => {

        console.log(req.body.ids)
        const historydeleted = reserve.deleteHistory(req.body.ids.map( id => Number(id)));

        const history = reserve.getHistory();
        const  message = historydeleted.length > 1 ? `Las reservas ${historydeleted} fueron eliminadas.` : `La reserva ${historydeleted} fue eliminada.`;

        if(historydeleted){
            return res.json({
                meta: {
                    status: 200
                },
                history: history,
                message: message
            })
        }else{
            return res.json({
                meta: {
                    status: 400
                },
                error: true,
                message: `No se ha podido eliminar las reservas`
            })
        }

    },

    reset: (req, res) => {
        const resetedreserves = reserve.reset();

        if(resetedreserves.error){
            return res.json({
                meta: {
                    status: 400
                },
                error: true,
                message: resetedreserves.message
            })
        }else{
            return res.json({
                meta: {
                    status: 200
                },
                data: resetedreserves
            })
        }
    },

    fields: (req, res) => {
        const fields = reserve.fields(req.body.fields);

        if(fields.error){
            return res.json({
                meta: {
                    status: 400
                },
                error: true,
                message: fields.message
            })
        }else{
            return res.json({
                meta: {
                    status: 200
                },
                message: `El campo cancha ha sido modificado`,
                data: fields
            })
        }
    },

    shedules: (req, res) => {
        const shedules = reserve.shedules(req.body.shedules);

        if(shedules.error){
            return res.json({
                meta: {
                    status: 400
                },
                error: true,
                message: shedules.message
            })
        }else{
            return res.json({
                meta: {
                    status: 200
                },
                message: `Los horarios ${req.body.shedules.shedules} han sido modificados`,
                data: shedules
            })
        }
    },

    charts: (req, res) => {

        const charts = reserve.getCharts();

        res.json({
            meta: {
                status: 200
            },
            data: charts
        })
    }
}