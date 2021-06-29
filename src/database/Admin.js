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
            token: token
        }

        this.admins.users.push(newadmin);
        this.admins.tokens.push(newtoken);

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
                users: [...this.admins.users.filter( user => user.name !== admin.name), findadmin],
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

    logout(admin) {

        const admintodeletetoken = this.find(admin.name);
        let sessionsbefore;

        this.admins.tokens.map( async token => {
            if(token.name === admin.name && bcrypt.compareSync(token.token, admin.token)){

                if(token.name === admin.name && token.sessions >= 1){
                    sessionsbefore = token.sessions;
                    token.sessions--

                    fs.writeFileSync(pathdatadmin,JSON.stringify(this.admins,null,' '));
                }

                if(token.name === admin.name && token.sessions === 0){
                    delete admintodeletetoken.token;

                    const adminlogout = {
                        users: [... await this.admins.users.filter( user => user.name !== admin.name), admintodeletetoken],
                        tokens: await this.admins.tokens.filter( token => token.name !== admin.name )
                    }

                    fs.writeFileSync(pathdatadmin,JSON.stringify(adminlogout,null,' '));
                }
            }
        });

        let logout;

        this.admins.tokens.map( user => {
            if(user){
                user.name === admin.name && user.sessions < sessionsbefore || user.sessions === 0
                    ? logout = { error: false, sessions: user.sessions }
                    : logout = { error: true };
            }else{
                logout = { error: true }
            }
        });

        console.log('ADMINS: ',this.admins)
        return logout;
    }
}

module.exports = { Admin };