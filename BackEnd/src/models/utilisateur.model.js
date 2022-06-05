const { Sequelize, DataTypes } = require('sequelize');
const {sequelize} = require('./db')



const Table_Utilisateurs = sequelize.define('Table_Utilisateurs', {
    // Model attributes are defined here
    id :
    {
        type         : DataTypes.UUID,
        primaryKey   : true,
        allowNull    : false,
        defaultValue : DataTypes.UUIDV4
    },
    pseudo :
    {
        type      : DataTypes.STRING,
        allowNull : false,
        required  : true
    },
    email :
    {
        type      : DataTypes.STRING,
        allowNull : false,
        required  : true,
        unique    : true
    },
    motDePasse :
    {
        type      : DataTypes.STRING,
        allowNull : false,
        required  : true
    },
    roles :
    {
        type      : DataTypes.JSON,
        allowNull : false,
        required  : true
    }
}, {
  // Other model options go here
});

module.exports = Table_Utilisateurs;
