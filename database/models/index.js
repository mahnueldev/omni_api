'use strict';
const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

// Load environment-specific configuration
const configPath = path.join(__dirname, '..','..', 'config', 'config.json');
const config = require(configPath)[env];

// Modify the Sequelize configuration based on environment
if (process.env.NODE_ENV === 'production') {
  // Load production environment variables from .env.production.local
  require('dotenv').config({ path: '.env.production.local' });
} else {
  // Load development environment variables from .env.development.local
  require('dotenv').config({ path: '.env.development.local' });
}

const db = {};

let connDB;
if (config.use_env_variable) {
  connDB = new Sequelize(process.env[config.use_env_variable], config);
} else {
  connDB = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(connDB, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

connDB
// .sync({ alter: true })
  .authenticate()
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((err) => {
    console.log('Error connecting to the database:', err);
  });

db.sequelize = connDB;
db.Sequelize = Sequelize;

module.exports = db;
