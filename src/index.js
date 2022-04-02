const express = require("express");
const MongoStore = require('connect-mongo')
const session = require('express-session')
const flash = require('connect-flash')
const morgan = require("morgan");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const path = require("path");
const operator = require('./models/operators')
const passport = require('passport')
const { create } = require('express-handlebars');
const csrf = require('csurf');
require('dotenv').config()
const clientDB = require('./database/db')
// Intializations
const app = express();

app.set("trust proxy", 1);
app.use(session({
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialize: false,
    name: 'mi-frase-secreta',
    store: MongoStore.create({
        clientPromise: clientDB,
        dbName: "coviddb"
    }),
    cookie: { secure: true, maxAge: 30 * 24 * 60 * 60 * 1000 },
}))

app.use(flash())
app.use(mongoSanitize());
app.use(passport.initialize())
app.use(passport.session())


const corsOptions = {
    credentials: true,
    origin: process.env.HEROPATH
};
app.use(cors(corsOptions));


passport.serializeUser((user, done) =>done(null, {id: user._id, mail: user.username}) 
);
passport.deserializeUser( async(user, done) =>{

const userdb = await operator.findById(user.id)
    //console.log('usuario encontrado: '+  userdb)
    return done(null, {id: userdb._id, mail: user.username})
})

// Settings
const PORT = process.env.PORT || 5000

const hbs = create({
    extname: '.hbs',
    partialsDir: [
        path.join(__dirname, 'views/components')
    ],
    helpers: {
       ifEquals: function(arg1, arg2, options) {
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        }
    }
});

// Middlewares
//app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//app.use(csrf());
app.use( (req,res,next) => {
//  res.locals.csrfToken = req.csrfToken();
  res.locals.mensajes = req.flash('mensajes');
   return next()
});



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