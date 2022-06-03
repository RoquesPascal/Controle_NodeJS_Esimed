const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');
const Table_PersonnesARencontrer = require("./personnes-a-rencontrer.model");



const Table_Images = sequelize.define('Table_Images', {
    id :
    {
        primaryKey   : true,
        type         : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4
    },
    idPersonneRencontree :
    {
        type      : DataTypes.UUID,
        allowNull : false,
        required  : true,

        references :
        {
            model : Table_PersonnesARencontrer,
            key   : 'id'
        }
    },
    nomUnique :
    {
        type      : DataTypes.STRING,
        allowNull : false
    },
    nomOriginal :
    {
        type      : DataTypes.STRING,
        allowNull : false
    },
    chemin :
    {
        type      : DataTypes.STRING,
        allowNull : false
    },
    type :
    {
        type : DataTypes.STRING
    },
    taille :
    {
        type : DataTypes.INTEGER
    },
}, {
    // Other model options go here
});

module.exports = Table_Images;
