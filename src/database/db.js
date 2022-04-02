const mongoose= require('mongoose');
require('dotenv').config();

const clientDB = mongoose

.connect('mongodb+srv://main-user:vNrpLaSSgpTC1Fb3@cluster0.fe3nl.mongodb.net/coviddb') 
    .then((m) => {
        console.log('Conectado a la Base de Datos ')
        return m.connection.getClient();
    })
    .catch(e => console.log(`Errod al conectar` + e))

    module.exports =  clientDB