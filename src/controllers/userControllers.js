const { validationResult } = require('express-validator')
const userSchema = require('../models/users')
const Puppeteer = require('puppeteer')


const readUsers = async (req, res) => {

    try {
        const users = await userSchema.find().lean();
        //res.json(users)
        //console.log(users);
        res.render('user', { users });
    } catch (error) {
        console.log('error ' + error)
    }
}

const addUserForm = (req, res) => {
    res.render('adduser')
}

const addUserProcess = async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash('mensajes', errors.array())
        return res.redirect('/adduser')
    }
    console.log('111111111111111111')
    const data = {
        fname,
        lname,
        bdate,
        mail,
        passport,
    } = (req.body)

    try {
        const newuser = new userSchema(data)
        await newuser.save()
        res.redirect('/user')

        // TODO https://mongoosejs.com/docs/4.x/docs/validation.html

    } catch (error) {
        console.log('entra en el catch')
        req.flash('mensajes', [{ msg: error.message }])
        return res.redirect('addUser')
    }



}


const deleteUser = async (req, res) => {
    const { id } = req.params
    console.log(id)
    try {
        await userSchema.findByIdAndDelete(id)
        res.redirect('/user')
    } catch (error) {
        console.log('error ' + error)
    }
}

const updateUserForm = (req, res) => {
    res.render('updateuser')
}

const updateUser = async (req, res) => {
    const id = req.params.id
    const data = {
        fname,
        lname,
        bdate,
        mail,
        passport,
    } = (req.body)
    try {
        await userSchema.findByIdAndUpdate(id, data);
        console.log('el id: ' + id + 'se ha actualizado con esta data => ' + JSON.stringify(data));
        res.redirect('/user')
    } catch (error) {
        console.log('error ' + error)

    }
}

const readcne = async (req, res) => {

    const cedula = req.params.cedula
    console.log('esta es la cedula ' + cedula);

    const navegador = await Puppeteer.launch();
    const page = await navegador.newPage();
    await page.goto(`http://www.cne.gob.ve/web/registro_electoral/ce.php?nacionalidad=V&cedula=${cedula}`)
    // await page.waitForNavigation({waitUntil: 'domcontentloaded'})
    const nombre = await page.$eval("body > table > tbody > tr > td > table > tbody > tr:nth-child(5) > td > table > tbody > tr:nth-child(2) > td > table:nth-child(1) > tbody > tr:nth-child(2) > td:nth-child(2) > b", el => el.textContent )
    const direccion = await page.$eval('body > table > tbody > tr > td > table > tbody > tr:nth-child(5) > td > table > tbody > tr:nth-child(2) > td > table:nth-child(1) > tbody > tr:nth-child(7) > td:nth-child(2)', el => el.textContent)  
    navegador.close()
res.send('desde el cne: ' + nombre + ' ' + 'Direccion del CNE ' + direccion)

}


module.exports = {
    readUsers,
    addUserProcess,
    deleteUser,
    updateUser,
    addUserForm,
    updateUserForm,
    readcne,

}