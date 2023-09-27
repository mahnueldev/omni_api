require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require("cors");
const corsOptions = require('./config/corsOptions');
// const config = require('./config/config');
const app = express();
const cookieParser = require('cookie-parser');
const db= require('./database/models/index');
const morgan = require('morgan');
const exphbs  = require('express-handlebars');
const PORT = process.env.PORT || 8080;
const {accessLogMiddleware, errorLogMiddleware } = require('./middleware/morganWare');
const verifyJWT= require('./middleware/verifyJWT');

app.use(express.json());

// Handlebars
const hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: null,
  partialsDir: path.join(__dirname, "public/views/partials"),  
});
// Run stattic files e.g css files
app.use(express.static(path.join(__dirname, 'public')));
// Register `hbs.engine` with the Express app.
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'public/views'));

app.use('/', require('./routes/web/pages'));




// Use HTTP request logger
app.use(morgan('dev'));

// Use HTTP request logger
app.use(accessLogMiddleware);
app.use(errorLogMiddleware);



// Use the cookie-parser middleware
app.use(cookieParser());


// Cross Origin Resource Sharing
app.use(cors(corsOptions));
// Routes
app.use('/api', require('./routes/api/register'));
app.use('/api', require('./routes/api/auth'));
app.use('/api', require('./routes/api/refresh'));


app.use(verifyJWT);
app.use('/api', require('./routes/api/user'));



//server
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
