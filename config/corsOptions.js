const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.development.local' });
} else {
  dotenv.config({ path: '.env.production.local' });
}

const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS.split(','),
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204 
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
    preflightContinue: false,
}

module.exports = corsOptions;

