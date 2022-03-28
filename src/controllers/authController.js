const operator = require("../models/operators")
const {nanoid} = require('nanoid')
const {validationResult} = require('express-validator')



const loginOperatorForm = (req, res) => {
    res.render('login', {mensajes: req.flash("mensajes")})
}


const loginOperatorProcess = async (req, res) => {
    
    const errors= validationResult(req)
    if(!errors.isEmpty()){
        req.flash('mensajes', errors.array())
        return res.redirect('login')
    }
    
    const {mail, password} =req.body
    console.log('la contraseña es: ' +password )
    try {
        
        const user = await operator.findOne({mail})
        if(!user) throw Error('El ususario no existe')
        if(!user.accountConfirm) throw Error('Por favor, revise su correo para activar la cuenta.')
        if(!await user.comparePassword(password))throw Error('constraseña invalida')
        res.redirect('/')

    } catch (error) {

        req.flash('mensajes', [{msg: error.message}])
        return res.redirect('login')
       
    }

}



const registerOperatorFrom = (req, res) => {
    res.render('registerOperator', {mensajes: req.flash("mensajes")})
}


const registerOperatorProcess = async (req, res) => {

    const errors= validationResult(req)
    if(!errors.isEmpty()){
        req.flash('mensajes', errors.array())
        return res.redirect('singup')
    }

    const { username,
            mail,
            password } = req.body
    
        try {
        let existOperator = await operator.findOne({ mail })
        if (existOperator) throw Error('Ya existe este usuario')

        const newOperator = new operator({ username, mail, password, tokenConfirm: nanoid()})
        await newOperator.save()
        console.log(existOperator)
        res.redirect('login' )


    } catch (error) {
        req.flash('mensajes', [{msg: error.message}])
        return res.redirect('singup')
    }


}

const confirmaccountprocess = async(req,res) =>{ 
    const {tokenConfirm} = req.params
    console.log('El token de la url es:' + tokenConfirm  )
    try {
        const tokenConfirmExist = await operator.findOne({tokenConfirm})
        if(!tokenConfirmExist) throw Error('no existe este usuario')
        
        tokenConfirmExist.accountConfirm = true
        tokenConfirmExist.tokenConfirm = null

        await tokenConfirmExist.save()
        res.json( tokenConfirmExist)
    } catch (error) {
        console.log('error' + error)        
        res.json({msg: "no existe este usuario"})
    }
    


}


module.exports = {
    loginOperatorForm,
    loginOperatorProcess,
    registerOperatorFrom,
    registerOperatorProcess,
    confirmaccountprocess
}