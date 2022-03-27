const express = require("express");
const session = require('express-session')
const flash = require('connect-flash')
const morgan = require("morgan");
const path = require("path");
const { create } = require('express-handlebars');
const dotenv =require('dotenv').config()
require('./database/db')

// Intializations
const app = express();

app.use(session({
    secret: '311ef93b7430166dbf9ddcf313e107f1f8b062845eb6c6492a52d622a51777c1',
    resave: false,
    saveUninitialize: false,
    name: 'mi-frase-secreta',
}))

// Settings
const PORT = process.env.PORT || 5000

const hbs = create({
    extname: '.hbs',
    partialsDir: [
        path.join(__dirname, 'views/components')
    ],
});

// Middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
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




// Global variables

// Public


app.listen(PORT, () => {
    console.log("Servidor corriendo en el puerto:", PORT);
});