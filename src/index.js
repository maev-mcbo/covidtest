const express = require("express");
const morgan = require("morgan");
const path = require("path");
const { create } = require('express-handlebars');
const dotenv = require('dotenv')
require('./database/db')

// Intializations
const app = express();
dotenv.config();

// Settings
const PORT = process.env.PORT || 5000

const hbs = create({
    extname: '.hbs',
});

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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