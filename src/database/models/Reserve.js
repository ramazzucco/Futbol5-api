module.exports = (sequelize, DataTypes) => {
    const cols = {
        cancha: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        horario: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        apellido: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        telefono: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }

    const config = {
        tableName : 'reserve',
        timestamps: false
    }

    const Reserve = sequelize.define('Reserve',cols,config);

    return Reserve;

}