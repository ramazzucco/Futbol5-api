'use strict'
const fs = require("fs");
const path = require("path");
const bcrypt = require('bcrypt');
const { v4: uuid } = require("uuid");
const pathdatadmin = path.join(__dirname,"../database/admins.json");

class Admin {
    constructor(){
       this.admins = JSON.parse(fs.readFileSync(pathdatadmin, { encoding: 'utf-8' }));
    }

    sortAdmin(a,b) {
        if (a.id > b.id) {
            return 1;
        }
        if (a.id < b.id) {
            return -1;
        }
        return 0;
    }

    sortToken(a,b) {
        if (a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }
        return 0;
    }

    wasCreated(object) {
        const findAdmin = this.admins.users.find( admin => admin.id === object.id);

        return findAdmin ? true : false;
    }

    find(name) {
        return this.admins.users.find( admin => admin.name === name);
    }

    create(admin) {
        const token = uuid();
        const tokenhashed = bcrypt.hashSync(token, 10);

        const newadmin = {
            id: this.admins.users.length + 1,
            name: admin.name,
            password: bcrypt.hashSync(admin.password, 10),
            token: tokenhashed
        }

        const newtoken = {
            name: admin.name,
            token: token,
            sessions: 1
        }

        this.admins.users.push(newadmin);
        this.admins.tokens.push(newtoken);

        this.admins.users.sort((a, b) => this.sortAdmin(a, b));
        this.admins.tokens.sort((a, b) => this.sortToken(a, b));

        fs.writeFileSync(pathdatadmin,JSON.stringify(this.admins,null,' '));

        return newadmin;
    }

    login(admin) {
        const findadmin = this.find(admin.name);
        const findtoken = this.admins.tokens.find( token => token.name === admin.name);

        // Si es la primera vez que inicia sesion, creo el token, sino, agrego un numero de sesion al token.
        if(!findtoken){
            const token = uuid();
            const tokenhashed = bcrypt.hashSync(token, 10);

            findadmin.token = tokenhashed;

            const adminlogged = {
                users: [...this.admins.users.filter( user => user.name !== admin.name), findadmin].sort((a, b) => this.sortAdmin(a, b)),
                tokens: [...this.admins.tokens, { name: admin.name, token: token, sessions: 1}]
            }

            fs.writeFileSync(pathdatadmin,JSON.stringify(adminlogged,null,' '));
        }else{
            this.admins.tokens.map( token => {
                if(token.name === admin.name){
                    token.sessions++
                }
            })

            fs.writeFileSync(pathdatadmin,JSON.stringify(this.admins,null,' '));
        }

        return this.find(admin.name);
    }

    // update(array) {

    // }

    async logout(admin) {

        const admintodeletetoken = this.find(admin.name);
        let sessionsbefore;

        const closesession = async () => {
            let response;

            await this.admins.tokens.map( token => {
                if(token.name === admin.name && bcrypt.compareSync(token.token, admin.token)){

                    if(token.name === admin.name && token.sessions >= 1){
                        sessionsbefore = token.sessions;
                        token.sessions--

                        fs.writeFileSync(pathdatadmin,JSON.stringify(this.admins,null,' '));
                    }

                    if(token.name === admin.name && token.sessions === 0){
                        delete admintodeletetoken.token;

                        const adminlogout = {
                            users: [...this.admins.users.filter( user => user.name !== admin.name), admintodeletetoken].sort((a, b) => this.sortAdmin(a, b)),
                            tokens: this.admins.tokens.filter( token => token.name !== admin.name )
                        }

                        fs.writeFileSync(pathdatadmin,JSON.stringify(adminlogout,null,' '));
                    }
                }

                return response = this.admins.tokens.find( user => user.name === admin.name);
            });

            return response;
        }

        const getclosesession = await closesession();

        console.log('getclosesession: ',getclosesession)

        let logout;

        if(getclosesession && getclosesession.sessions === sessionsbefore){
            logout = { error: true }
        }else if(getclosesession && getclosesession.sessions < sessionsbefore){
            logout = { error: false, sessions: getclosesession.sessions }
        }else if(!getclosesession){
            logout = { error: false }
        }

        return logout;
    }
}

module.exports = { Admin };