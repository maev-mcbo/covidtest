const operator = require("../models/operators")
const {nanoid} = require('nanoid')
const {validationResult} = require('express-validator')
const transport = require('../nodemailer/transport')
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
        
        const user = await operator.findOne({mail: mail})
        console.log('EL USUARIO ES: ' + user)
        if(!user) throw Error('El ususario no existe');
        if(!user.accountConfirm) throw Error('Por favor, revise su correo para activar la cuenta.');
        if(!await user.comparePassword(password))throw Error('constraseña invalida');
        
        // crea la sesion del usuario 
        req.login(user, function(error){
            if (error) throw new Error('Error al crear la sesion');
            return res.redirect('/order/orderlist')
        })

    } catch (error) {

        req.flash('mensajes', [{msg: error.message}])
        console.log('hay errores' + error );
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
        return res.redirect('/auth/login')
    }

    const { username,
            mail,
            password } = req.body
    
        try {
        let existOperator = await operator.findOne({ mail })
        if (existOperator) throw Error('Ya existe este usuario')

        const newOperator = new operator({ username, mail, password, tokenConfirm: nanoid()})
        console.log( 'A ESTE CORREO SE VA A ENVIAR LA CONFIRMACION    '+ newOperator.mail)
        
        
        await transport.sendMail({
            from:'hs',
            to: newOperator.mail,
            subject: 'activa tu cuenta',
            html: `<a href="${process.env.CONFIRMACCOUNT + newOperator.tokenConfirm}"> Verifica tu cuenta aqui</a><!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings></xml><![endif]--> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta name="x-apple-disable-message-reformatting"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title></title> <style type="text/css"> @media only screen and (min-width: 620px){.u-row{width: 600px !important;}.u-row .u-col{vertical-align: top;}.u-row .u-col-100{width: 600px !important;}}@media (max-width: 620px){.u-row-container{max-width: 100% !important; padding-left: 0px !important; padding-right: 0px !important;}.u-row .u-col{min-width: 320px !important; max-width: 100% !important; display: block !important;}.u-row{width: calc(100% - 40px) !important;}.u-col{width: 100% !important;}.u-col>div{margin: 0 auto;}}body{margin: 0; padding: 0;}table, tr, td{vertical-align: top; border-collapse: collapse;}p{margin: 0;}.ie-container table, .mso-container table{table-layout: fixed;}*{line-height: inherit;}a[x-apple-data-detectors='true']{color: inherit !important; text-decoration: none !important;}table, td{color: #000000;}a{color: #0000ee; text-decoration: underline;}</style> <link href="https://fonts.googleapis.com/css?family=Cabin:400,700" rel="stylesheet" type="text/css"> </head><body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #f9f9f9;color: #000000"> <table style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #f9f9f9;width:100%" cellpadding="0" cellspacing="0"> <tbody> <tr style="vertical-align: top"> <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;"> <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"> <div style="width: 100% !important;"> <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"> <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left"> <div style="color: #afb0c7; line-height: 170%; text-align: center; word-wrap: break-word;"> <p style="font-size: 14px; line-height: 170%;"><span style="font-size: 14px; line-height: 23.8px;">View Email in Browser</span></p></div></td></tr></tbody> </table> </div></div></div></div></div></div><div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;"> <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"> <div style="width: 100% !important;"> <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"> <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td style="overflow-wrap:break-word;word-break:break-word;padding:20px;font-family:'Cabin',sans-serif;" align="left"> <table width="100%" cellpadding="0" cellspacing="0" border="0"> <tr> <td style="padding-right: 0px;padding-left: 0px;" align="center"> <img align="center" border="0" src="https://images.unlayer.com/projects/72662/1648860007976-logo.jpg" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 32%;max-width: 179.2px;" width="179.2"/> </td></tr></table> </td></tr></tbody> </table> </div></div></div></div></div></div><div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #003399;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;"> <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"> <div style="width: 100% !important;"> <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"> <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td style="overflow-wrap:break-word;word-break:break-word;padding:40px 10px 10px;font-family:'Cabin',sans-serif;" align="left"> <table width="100%" cellpadding="0" cellspacing="0" border="0"> <tr> <td style="padding-right: 0px;padding-left: 0px;" align="center"> <img align="center" border="0" src="https://cdn.templates.unlayer.com/assets/1597218650916-xxxxc.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 26%;max-width: 150.8px;" width="150.8"/> </td></tr></table> </td></tr></tbody> </table> <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left"> <div style="color: #e5eaf5; line-height: 140%; text-align: center; word-wrap: break-word;"> <p style="font-size: 14px; line-height: 140%;"><strong>Gracias por confiar en nostros, cuando la duda existe nosotros somos tu seguridad</strong></p></div></td></tr></tbody> </table> <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 31px;font-family:'Cabin',sans-serif;" align="left"> <div style="color: #e5eaf5; line-height: 140%; text-align: center; word-wrap: break-word;"> <p style="font-size: 14px; line-height: 140%;"><span style="font-size: 28px; line-height: 39.2px;"><strong><span style="line-height: 39.2px; font-size: 28px;">Verifica tu Correo Electr&oacute;nico</span></strong> </span> </p></div></td></tr></tbody> </table> </div></div></div></div></div></div><div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;"> <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"> <div style="width: 100% !important;"> <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"> <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td style="overflow-wrap:break-word;word-break:break-word;padding:33px 55px;font-family:'Cabin',sans-serif;" align="left"> <div style="line-height: 160%; text-align: center; word-wrap: break-word;"> <p style="font-size: 14px; line-height: 160%;"><span style="font-size: 22px; line-height: 35.2px;">hola, ${username}</span></p><p style="font-size: 14px; line-height: 160%;"><span style="font-size: 18px; line-height: 28.8px;">Ya solo falta este paso para que pueda comenzar a trabajar con nosotros, haz clic en el botón de abajo.</span></p></div></td></tr></tbody> </table> <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left"> <div align="center"> <a href="${process.env.CONFIRMACCOUNT + newOperator.tokenConfirm}" target="_blank" style="box-sizing: border-box;display: inline-block;font-family:'Cabin',sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #ff6600; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;"> <span style="display:block;padding:14px 44px 13px;line-height:120%;"><span style="font-size: 16px; line-height: 19.2px;"><strong><span style="line-height: 19.2px; font-size: 16px;">Verifica tu correo</span></strong> </span> </span> </a> </div></td></tr></tbody> </table> <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td style="overflow-wrap:break-word;word-break:break-word;padding:33px 55px 60px;font-family:'Cabin',sans-serif;" align="left"> <div style="line-height: 160%; text-align: center; word-wrap: break-word;"> <p style="line-height: 160%; font-size: 14px;"><span style="font-size: 18px; line-height: 28.8px;">Gracias,</span></p><p style="line-height: 160%; font-size: 14px;"><span style="font-size: 18px; line-height: 28.8px;">SGPC, C.A.</span></p></div></td></tr></tbody> </table> </div></div></div></div></div></div><div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #003399;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;"> <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"> <div style="width: 100% !important;"> <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"> <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left"> <div style="color: #fafafa; line-height: 180%; text-align: center; word-wrap: break-word;"> <p style="font-size: 14px; line-height: 180%;"><span style="font-size: 16px; line-height: 28.8px;">Este es un proyecto de aprendizaje.</span></p></div></td></tr></tbody> </table> </div></div></div></div></div></div></td></tr></tbody> </table> </body></html>`
        });
        await newOperator.save()

        req.flash('mensajes', [{ msg: 'Revisa tu correo para activar tu cuenta' }])
        res.redirect('/auth/login' )


    } catch (error) {
        req.flash('mensajes', [{ msg: error.message }])
        return res.redirect('/auth/login')
    }


}

const confirmaccountprocess = async(req,res) =>{ 

    const errors= validationResult(req)
    if(!errors.isEmpty()){
        req.flash('mensajes', errors.array())
        return res.redirect('login')
    }

    const {tokenConfirm} = req.params
    //console.log('El token de la url es:' + tokenConfirm  )
    try {
        const tokenConfirmExist = await operator.findOne({tokenConfirm: tokenConfirm})
       // console.log('token encontrado en la BASE DE DATOS '+tokenConfirmExist)
        if(!tokenConfirmExist) throw Error('no existe este usuario')
        
        tokenConfirmExist.accountConfirm = true
        tokenConfirmExist.tokenConfirm = null

        await tokenConfirmExist.save()
        req.flash('mensajes', [{ msg: "Bienvenido, tu cuenta se ha activado" }])

        res.redirect('/order/orderlist')

      //  req.flash("mensajes", [{msg: "bienvenido"}]);
    } catch (error) {
        req.flash('mensajes', [{ msg: error.message }])
        return res.redirect('/order/orderlist')
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