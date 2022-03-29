const operator = require("../models/operators")
const {nanoid} = require('nanoid')
const {validationResult} = require('express-validator')
const nodemailer = require('nodemailer')
require('dotenv')



const loginOperatorForm = (req, res) => {
    res.render('login' )
}


const loginOperatorProcess = async (req, res) => {
    
    const errors= validationResult(req)
    if(!errors.isEmpty()){
        req.flash('mensajes', errors.array())
        return res.redirect('login')
    }
    
    const {mail, password} =req.body
   // console.log('la contraseña es: ' +password )
    try {
        
        const user = await operator.findOne({mail})
        console.log('EL USUARIO ES: ' + user)
        if(!user) throw Error('El ususario no existe');
        if(!user.accountConfirm) throw Error('Por favor, revise su correo para activar la cuenta.');
        if(!await user.comparePassword(password))throw Error('constraseña invalida');
        console.log('estoy en el catch');
        
        // crea la sesion del usuario 
        req.login(user, function(error){
            if (error) throw new Error('Error al crear la sesion');
            return res.redirect('/order/orderlist')
        })

    } catch (error) {

        req.flash('mensajes', [{msg: error.message}])
        return res.redirect('login')
       
    }
}



const registerOperatorFrom = (req, res) => {
    res.render('registerOperator')
}


const registerOperatorProcess = async (req, res) => {

    const errors= validationResult(req)
    if(!errors.isEmpty()){
        req.flash('mensajes', errors.array())
        return res.redirect('singup')
    }

    const transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 25,
        auth: {
          user: "f5f3b1819cd6f7", // generated ethereal user
          pass: "c6dec2891033f7", // generated ethereal password
        },
      });

    const { username,
            mail,
            password } = req.body
    
        try {
        let existOperator = await operator.findOne({ mail })
        if (existOperator) throw Error('Ya existe este usuario')

        const newOperator = new operator({ username, mail, password, tokenConfirm: nanoid()})
        console.log( 'A ESTE CORREO SE VA A ENVIAR LA CONFIRMACION    '+ newOperator.mail)
        await newOperator.save()
        
        
        const info = await transport.sendMail({
            from:'hs',
            to: newOperator.mail,
            subject: 'activa tu cuenta',
            html: `<a href="${process.env.CONFIRMACCOUNT + newOperator.tokenConfirm}"> Verifica tu cuenta aqui</a>`
        });
        console.log("Message sent: %s", info.messageId);


        res.redirect('login' )


    } catch (error) {
        req.flash('mensajes', [{ msg: error.message }])
        return res.redirect('singup')
    }


}

const confirmaccountprocess = async(req,res) =>{ 
    const {tokenConfirm} = req.params
    console.log('El token de la url es:' + tokenConfirm  )
    try {
        const tokenConfirmExist = await operator.findOne({tokenConfirm: tokenConfirm})
        console.log('token encontrado en la BASE DE DATOS '+tokenConfirmExist)
        if(!tokenConfirmExist) throw Error('no existe este usuario')
        
        tokenConfirmExist.accountConfirm = true
        tokenConfirmExist.tokenConfirm = null

        await tokenConfirmExist.save()
        res.redirect('/order/orderlist')

      //  req.flash("mensajes", [{msg: "bienvenido"}]);
    } catch (error) {
        req.flash('mensajes', [{ msg: error.message }])
        return res.redirect('/login')
    }
    


}

const logoutProcess = (req, res) => { 
    req.logout()
    return res.redirect('/auth/login')
}


module.exports = {
    loginOperatorForm,
    loginOperatorProcess,
    registerOperatorFrom,
    registerOperatorProcess,
    confirmaccountprocess,
    logoutProcess
}