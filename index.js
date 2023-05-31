const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require("connect-mongo");
const sassMiddleware = require('node-sass-middleware');

const app = express();
const port = 8000;

app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));

app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static('./assets'));

app.use(expressLayouts);

app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
    name: 'quiklink',
    //TODO change secretbefore deployment 
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create({
        mongooseConnection: db,
        autoRemove: "disabled",
        // Added next line from stackoverflow to remove the (session) parameter from line 13
        mongoUrl: 'mongodb://localhost/quiklink'
      }),function(error){
        console.log(error || 'connect-mongodb setup okay');
      }
    })
  );

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use('/', require('./routes'));

app.listen(port, (err) => {
    if (err) console.log(`Error in running server: ${err}`);
    console.log(`Server is running on port: ${port}`);
});