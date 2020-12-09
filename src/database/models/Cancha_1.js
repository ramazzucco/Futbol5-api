module.exports = (sequelize, DataTypes) => {
    const cols = {
        hora: {
            type: DataTypes.STRING,
            allowNull: false
        },
        reservado: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        canchaN: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        reserve_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        }
    }

    const config = {
        tableName : 'cancha_1',
        timestamps: true
    }

    const Cancha_1 = sequelize.define('Cancha_1',cols,config);

    return Cancha_1;

}