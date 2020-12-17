module.exports = (sequelize, DataTypes) => {
    const cols = {
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
            allowNull: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }

    const config = {
        tableName : 'usuarios',
        timestamps: false
    }

    const User = sequelize.define('User',cols,config);

    return User;

}