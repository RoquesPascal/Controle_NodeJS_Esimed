const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const User = sequelize.define('User', {
  // Model attributes are defined here
  id: {
    type: UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: UUIDV4
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

// `sequelize.define` also returns the model
console.log(User === sequelize.models.User); // true
