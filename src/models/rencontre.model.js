const { Sequelize, DataTypes } = require('sequelize');
const {sequelize} = require('./db')



const Table_Rencontres = sequelize.define('Table_Rencontres', {
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
        type      : DataTypes.STRING,
        allowNull : false,
        required  : true
    },
    dateNaissance :
    {
        type      : DataTypes.DATEONLY,
        allowNull : false,
        required  : true
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
        allowNull : false,
        required  : true
    }
}, {
    // Other model options go here
});

module.exports = Table_Rencontres;
