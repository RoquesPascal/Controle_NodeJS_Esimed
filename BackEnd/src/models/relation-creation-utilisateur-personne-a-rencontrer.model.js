const { Sequelize, DataTypes } = require('sequelize');
const {sequelize} = require('./db')
const Table_Utilisateurs = require("./utilisateur.model");
const Table_PersonnesARencontrer = require("./personnes-a-rencontrer.model");



const Table_RelationCreationUtilisateurPersonnesARencontrer = sequelize.define('Table_RelationCreationUtilisateurPersonnesARencontrer', {
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
    idPersonneRencontree :
    {
        type      : DataTypes.UUID,
        allowNull : false,
        required  : true,

        references:
        {
            model : Table_PersonnesARencontrer,
            key   : 'id'
        }
    }
}, {
    // Other model options go here
});

module.exports = Table_RelationCreationUtilisateurPersonnesARencontrer;
