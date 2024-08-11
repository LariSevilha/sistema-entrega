const connection = require('../database/connection');
const { DataTypes } = require('sequelize');

const User = connection.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'Users',
  timestamps: true
});

User.associate = function (models) {
  User.hasMany(models.Pacote, {
    foreignKey: 'userId',
    as: 'pacotes'
  });
};

module.exports = User;