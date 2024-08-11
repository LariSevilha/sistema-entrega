const Sequelize = require('sequelize');
const connection = require('../database/connection');
const User = require('./user');
const Pacote = require('./pacote');

// Define relações


User.associate({ Pacote });

module.exports = { User, Pacote };