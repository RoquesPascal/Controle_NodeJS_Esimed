const { Sequelize, DataTypes } = require('sequelize');
const {sequelize} = require('./db')
const Table_Rencontres = require("./rencontre.model");



const Table_PersonnesARencontrer = sequelize.define('Table_PersonnesARencontrer', {
    // Model attributes are defined here
    id :
    {
        type         : DataTypes.UUID,
        primaryKey   : true,
        allowNull    : false,
        defaultValue : DataTypes.UUIDV4
    },
    nom :
    {
        type      : DataTypes.STRING,
        allowNull : false,
        required  : true
    },
    prenom :
    {
        type      : DataTypes.STRING,
        allowNull : false,
        required  : true
    },
    sexe :
    {
        type      : DataTypes.INTEGER,
        allowNull : false,
        required  : true
    },
    dateNaissance :
    {
        type      : DataTypes.DATEONLY,
        allowNull : true,
        required  : false
    }
}, {
    // Other model options go here
});

module.exports = Table_PersonnesARencontrer;
