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
        tableName : 'cancha_3',
        timestamps: true
    }

    const Cancha_3 = sequelize.define('Cancha_3',cols,config);

    return Cancha_3;

}