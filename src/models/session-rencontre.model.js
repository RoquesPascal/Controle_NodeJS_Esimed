const { Sequelize, DataTypes } = require('sequelize');
const {sequelize} = require('./db')

const Table_SessionsRencontres = sequelize.define('Table_SessionsRencontres', {
    // Model attributes are defined here
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    idUtilisateur: {
        type: DataTypes.UUID,
        allowNull: false,
        required: true
    },
    idRencontre: {
        type: DataTypes.UUID,
        allowNull: false,
        required: true
    }
}, {
    // Other model options go here
});

module.exports = Table_SessionsRencontres;
