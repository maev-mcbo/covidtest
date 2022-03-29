const express = require("express");
const session = require('express-session')
const flash = require('connect-flash')
const morgan = require("morgan");
const path = require("path");
const operator = require('./models/operators')
const passport = require('passport')
const { create } = require('express-handlebars');
const csrf = require('csurf');
require('dotenv').config()
require('./database/db')

// Intializations
const app = express();

app.use(session({
    secret: '311ef93b7430166dbf9ddcf313e107f1f8b062845eb6c6492a52d622a51777c1',
    resave: false,
    saveUninitialize: false,
    name: 'mi-frase-secreta',
}))

app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) =>done(null, {id: user._id, mail: user.username}) 
);
passport.deserializeUser( async(user, done) =>{

const userdb = await operator.findById(user.id)
    console.log('usuario encontrado: '+  userdb)
    return done(null, {id: userdb._id, mail: user.username})
})

// Settings
const PORT = process.env.PORT || 5000

const hbs = create({
    extname: '.hbs',
    partialsDir: [
        path.join(__dirname, 'views/components')
    ],
});

// Middlewares
//app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

app.use(csrf());
app.use( (req,res,next) => {
    res.locals.csrfToken = req.csrfToken();
    res.locals.mensajes = req.flash('mensajes');
    return next()
});

app.use(express.json());
//hbs
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', './src/views');

app.use(express.static(path.join(__dirname, "public")));
//Routes
app.use('/', require('./routes'));
app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/user'));
app.use('/order',require('./routes/order'))




// Global variables

// Public


app.listen(PORT, () => {
    console.log("Servidor corriendo en el puerto:", PORT);
});