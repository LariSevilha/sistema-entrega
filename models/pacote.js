
const connection = require('../database/connection');
const { DataTypes } = require('sequelize');

const Pacote = connection.define('Pacote', {
  remetente: {
    type: DataTypes.STRING,
    allowNull: false
  },
  destinatario: {
    type: DataTypes.STRING,
    allowNull: false
  },
  endereco: {
    type: DataTypes.STRING,   
    allowNull: true   
  },
  userId: {  
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  tableName: 'pacotes',
  timestamps: true
});

module.exports = Pacote;