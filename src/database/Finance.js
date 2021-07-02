'use strict'
const fs = require("fs");
const path = require("path");
const pathdatafinance = path.join(__dirname,"../database/finance.json");
const pathdatahistory = path.join(__dirname,"../database/history.json");

class Finance {
    constructor(){
        this.rate = 2000;
        this.history = JSON.parse(fs.readFileSync(pathdatahistory, { encoding: 'utf-8' }));
        this.finance = JSON.parse(fs.readFileSync(pathdatafinance, { encoding: 'utf-8' }));
    }

    getData(){
        this.finance.income = this.history.length * this.rate;

        let result = 0;

        this.finance.taxes.map( tax => result = result + tax.amount );

        this.finance.debt = result;

        return this.finance;
    }
}

module.exports = { Finance };