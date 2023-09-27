const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.development.local' });
} else {
  dotenv.config({ path: '.env.production.local' });
}

const config = {
  development: {
    username: process.env.DB_USERNAME ,
    password: process.env.DB_PASSWORD ,
    port: process.env.DB_PORT ,
    database: process.env.DB_NAME ,
    host: process.env.DB_HOST ,
    dialect: process.env.DB_DIALECT
  },
  test: {
    username: 'root',
    password: 'rootwck',
    port: '3306',
    database: 'omni_api',
    host: '127.0.0.1',
    dialect: 'mysql',
    operatorsAliases: false
  },
  production: {
    username: process.env.DB_USERNAME ,
    password: process.env.DB_PASSWORD ,
    port: process.env.DB_PORT ,
    database: process.env.DB_NAME ,
    host: process.env.DB_HOST ,
    dialect: process.env.DB_DIALECT,
    operatorsAliases: false
  }
};

module.exports = config;
