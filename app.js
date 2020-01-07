// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const flash = require('req-flash');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const config = require('./config/database');


// Initialize Express App
const app = express();

// Imports Routes For The Movies
const movieRoutes = require('./routes/movie.route');
const userRoutes = require('./routes/user.route');

// Set Up Mongoose Connection
let dev_db_url = config.database;
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, '\n\n *** MongoDB connection error:'));

// App Use
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
  secret: 'yourMOM',
  resave: true,
  saveUninitialized: true
}));
app.use(flash());

// app.use(express.static(__dirname + '/public/'));
app.use('*/images', express.static(path.join(__dirname, 'public/images')));
app.use('*/js', express.static(path.join(__dirname, 'public/js')));
app.use('*/css', express.static(path.join(__dirname, 'public/css')));

// App Set
app.set('views', path.join(__dirname, '/views/'));
app.engine('.hbs', expressHandlebars({
  extname: '.hbs',
  // defaultLayout: 'mainLayout',
  layoutsDir: __dirname + '/views/layouts',
  helpers: {
    ifEquals: (arg1, arg2, options) => {
      return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    }
  }
}));
app.set('view engine', '.hbs');
// app.set('views', path.join(__dirname, 'views'));

// Passport
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res, next) => {
  res.locals.loggedInUser = req.user || null;
  next();
});

app.use("/", movieRoutes);
app.use('/', userRoutes);

// Server Start
let portNumber = process.env.PORT || 3000;

app.listen(portNumber, () => {
    console.log("*** Server is running on port: " + portNumber);
});


