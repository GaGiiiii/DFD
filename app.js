// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const flash = require('req-flash');


// Initialize Express App
const app = express();

// Imports Routes For The Movies
const movieRoutes = require('./routes/movie.route');

// Set Up Mongoose Connection
let dev_db_url = 'mongodb://admin:admin123@ds135068.mlab.com:35068/dfd';
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, '\n\n *** MongoDB connection error:'));

// App Use
app.use(session({
  cookie: {
    maxAge: 60000
  },
  secret: 'woot',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/", movieRoutes);
// app.use(express.static(__dirname + '/public/'));
app.use('*/images', express.static(path.join(__dirname, 'public/images')));
app.use('*/js', express.static(path.join(__dirname, 'public/js')));
app.use('*/css', express.static(path.join(__dirname, 'public/css')));

// App Set
app.set('views', path.join(__dirname, '/views/'));
app.engine('.hbs', expressHandlebars({
  extname: '.hbs',
  // defaultLayout: 'mainLayout',
  layoutsDir: __dirname + '/views/layouts'
}));
app.set('view engine', '.hbs');
// app.set('views', path.join(__dirname, 'views'));


// Server Start
let portNumber = 3000;

app.listen(portNumber, () => {
    console.log("*** Server is running on port: " + portNumber);
});


