const { Finance } = require('../database/Finance');
const finance = new Finance();

module.exports = {
    finance: (req, res) => {

        const getfinance = finance.getData();

        res.json({
            meta: {
                status: 200
            },
            data: getfinance
        })
    }
}