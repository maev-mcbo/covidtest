const { findByIdAndDelete, findById } = require('../models/users');
const userSchema = require('../models/users')

const readUsers = async (req, res) => {

    try {
        const users = await userSchema.find().lean();
        res.render('user', { users });
    } catch (error) {
        console.log('error ' + error)
    }
}

const addUser = async (req, res) => {

    const data = {
        fname,
        lname,
        bdate,
        mail,
        passport,
    } = (req.body)

    if (Object.keys(data).length === 0) {
        res.send('No hay datos para agregar')
    } else {
        try {
            const newuser = new userSchema(data)
            console.log(newuser)
            await newuser.save()
            res.redirect('/user')
            console.log('USUARIO AGREGADO A LA BASE DE DATOS')
            // TODO https://mongoosejs.com/docs/4.x/docs/validation.html
        } catch (error) {
            console.log('error ' + error)
        }
    }
    console.log(req.body)
    res.render('adduser')
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

module.exports = {
    readUsers,
    addUser,
    deleteUser,
    updateUser
}