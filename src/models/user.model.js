const { Sequelize, DataTypes } = require('sequelize');
const {sequelize} = require('./db')

const User = sequelize.define('User', {
  // Model attributes are defined here
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    required: true
  },
  lastName: {
    type: DataTypes.STRING,
    required: true
    // allowNull defaults to true
  },
  password: {
    type: DataTypes.STRING,
    required: true
  }
}, {
  // Other model options go here
});

module.exports = User;
