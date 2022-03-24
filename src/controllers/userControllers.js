const userSchema = require('../models/users')

const readUsers = async (req, res) => {
    const date = (new Date()).toString();
    const users = [
        {
            'fname': 'mario',
            'lname': 'echeverria',
            'bdate': '19-02-1990',
            'mail': 'lcdoecheverria@gmail.com',
            'passport': '100100100',
            'createAt': date
        },
        {
            'fname': 'Octaviano',
            'lname': 'echeverria',
            'bdate': '22-09-1950',
            'mail': 'octachegon@gmail.com',
            'passport': '200200200',
            'createAt': date
        }

    ];
    res.render('user', { users });
}

const addUser = async (req,res) =>{
    
    try {
        const newUser = new userSchema({fname:'jose'});
        console.log(newUser)
        res.send('nuevo usuario agregado' + newUser)
        return
    } catch (error) {
        console.log('existe error' + error)
        res.send('algo fallo')
    }
   
    const usuario = req.body
    console.log(usuario)
    res.render('adduser')

}


module.exports = {
    readUsers,
    addUser
}