const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');
const User = require('./user.model');



const Table_Images = sequelize.define('Table_Images', {
    id :
    {
        primaryKey   : true,
        type         : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4
    },
    uniqueName :
    {
        type      : DataTypes.STRING,
        allowNull : false
    },
    originalName :
    {
        type      : DataTypes.STRING,
        allowNull : false
    },
    path :
    {
        type      : DataTypes.STRING,
        allowNull : false
    },
    mimeType :
    {
        type : DataTypes.STRING
    },
    size :
    {
        type : DataTypes.INTEGER
    },
}, {
    // Other model options go here
});

module.exports = Table_Images;
