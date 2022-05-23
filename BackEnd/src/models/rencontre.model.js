const { Sequelize, DataTypes } = require('sequelize');
const {sequelize} = require('./db');
const Table_Utilisateurs = require("./utilisateur.model");
const Table_PersonnesARencontrer = require("./personnes-a-rencontrer.model");



const Table_Rencontres = sequelize.define('Table_Rencontres', {
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
    },
    dateRencontre :
    {
        type      : DataTypes.DATEONLY,
        allowNull : false,
        required  : true
    },
    note :
    {
        type      : DataTypes.INTEGER,
        allowNull : false,
        required  : true
    },
    commentaire :
    {
        type      : DataTypes.STRING,
        allowNull : true,
        required  : false
    }
}, {
    // Other model options go here
});

module.exports = Table_Rencontres;
