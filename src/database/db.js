const mongoose= require('mongoose')


mongoose.connect(process.env.URI) 
    .then(() => {console.log('Conectado a la Base de Datos ')})
    .catch(e => console.log(`Errod al conectar` + e))
