'use strict'
const fs = require("fs");
const path = require("path");
const bcrypt = require('bcrypt');
const { v4: uuid } = require("uuid");
const { Admin } = require('../database/Admin');
const { validationResult } = require("express-validator");
const { Reserve } = require('../database/Reserve');

const admin = new Admin();
const reserve = new Reserve();


module.exports = {

    admins: (req, res) => {
        const admins =  admin.admins;

        if(admins){
            return res.json({
                meta: {
                    status: 200
                },
                data: admins
            })
        }else{
            return res.json({
                meta: {
                    status: 400
                },
                error: true,
                message: 'No se ha encontrado la informacion'
            })
        }
    },

    register: (req, res) => {
        const errors = validationResult(req).errors;

        if(errors.length) {
            console.log(errors)

             return res.json({
                meta: {
                    status: 400
                },
                error: true,
                data: errors
            })

        }

        if(!admin.find(req.body.name)){
            const newadmin = admin.create(req.body);

            if(admin.wasCreated(newadmin)){
                return res.json({
                    meta: {
                        status: 200
                    },
                    user: newadmin
                })
            }else{
                return res.json({
                    meta: {
                        status: 500
                    },
                    error: true,
                    data: [{
                        param: 'key',
                        msg: 'Error de servidor, lo sentimos, intentelo mas tarde!'
                    }]
                })
            }
        }

        res.json({
            meta: {
                status: 400
            },
            error: true,
            data: [{
                msg: "Ya existe un usuario con ese email!",
                param: "email",
                value: req.body.email
            }]
        })
    },

    login: (req, res) => {

        let errors = validationResult(req).errors;

        if(errors.length) {

            console.log(errors);

            return res.json({
                meta: {
                    status: 300,
                },
                error: true,
                data: errors
            })
        }

        const user = admin.find(req.body.name);

        if(user){

            if(!bcrypt.compareSync(req.body.password, user.password)){
                return res.json({
                    meta: {
                        status: 400
                    },
                    error: true,
                    data: [{
                        msg: "La contraseña no es correcta.",
                        param: "password",
                        value: req.body.password
                    }]
                })
            }

            admin.login(req.body);

            return res.json({
                meta: {
                    status: 200
                },
                user: user
            })

        }else{

            return res.json({
                meta: {
                    status: 400
                },
                error: true,
                data: [{
                    msg: "El nombre de usuario no es correcto.",
                    param: "name",
                    value: req.body.name
                }]
            })
        }
    },

    session: (req, res) => {

        const getadmin = admin.find(req.body.name);

        if(getadmin){

            return res.json({
                meta: {
                    status: 200
                },
                user: getadmin
            })

        }else{

            return res.json({
                meta: {
                    status: 400
                },
                session: false,
                message: 'Lo sentimos, no se pudo encontrar el usuario.'
            })
        }
    },

    logout: async (req, res) => {

        const logout = await admin.logout(req.body);

        console.log('logout: ',logout)

        if(logout && !logout.error){

            if(logout.sessions === 0){
                const resetreserves = reserve.reset();

                if(resetreserves.error){
                    return res.json({
                        meta: {
                            status: 400
                        },
                        logout: false,
                        message: resetreserves.message
                    })
                }
            }

            return res.json({
                meta: {
                    status: 200
                },
                logout: true,
                message: 'La session se ha cerrado correctamente.'
            })

        }else{

            return res.json({
                meta: {
                    status: 400
                },
                logout: false,
                message: 'La session no se ha podido cerrar.'
            })
        }

    }
}
