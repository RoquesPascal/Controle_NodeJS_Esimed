const { Sequelize, DataTypes } = require('sequelize');
const {sequelize} = require('./db');
const Table_Utilisateurs = require("../models/utilisateur.model");
const Table_Rencontres = require("../models/rencontre.model");



const Table_SessionsRencontres = sequelize.define('Table_SessionsRencontres', {
    // Model attributes are defined here
    id :
    {
        type         : DataTypes.UUID,
        primaryKey   : true,
        allowNull    : false,
        defaultValue : DataTypes.UUIDV4
    },
    idUtilisateur :
    {
        type      : DataTypes.UUID,
        allowNull : false,
        required  : true,

        references:
        {
            model : Table_Utilisateurs,
            key   : 'id'
        }
    },
    idRencontre :
    {
        type      : DataTypes.UUID,
        allowNull : false,
        required  : true,

        references:
        {
            model : Table_Rencontres,
            key   : 'id'
        }
    }
}, {
    // Other model options go here
});

module.exports = Table_SessionsRencontres;
