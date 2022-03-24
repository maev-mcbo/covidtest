const mongoose= require('mongoose')


mongoose.connect("mongodb+srv://main-user:vNrpLaSSgpTC1Fb3@cluster0.fe3nl.mongodb.net/coviddb") 
    .then(() => {console.log('Conectado a la Base de Datos ')})
    .catch(e => console.log(`Errod al conectar` + e))
