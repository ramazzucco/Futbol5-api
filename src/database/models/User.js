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
            allowNull: false
        },
        telefono: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }

    const config = {
        tableName : 'usuarios',
        timestamps: false
    }

    const Usuario = sequelize.define('Usuario',cols,config);

    return Usuario;

}