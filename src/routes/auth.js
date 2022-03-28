const { Router } = require('express')
router = Router();
const { body } = require('express-validator');
const req = require('express/lib/request');
const {
    loginOperatorForm,
    registerOperatorFrom,
    registerOperatorProcess,
    loginOperatorProcess,
    confirmaccountprocess
} = require('../controllers/authController')


router.get('/login', loginOperatorForm)

router.post('/login',[
    body('mail','Favor ingrese un correo valido')
        .trim()
        .escape()
        .isEmail()
        .normalizeEmail()
        .notEmpty(),
    body('password','La contraseña no es valida')
        .isLength({min: 6})
        .trim()
        .escape()
],loginOperatorProcess)

router.get('/singup', registerOperatorFrom)
router.post('/singup',[
    body('username', 'Favor verificar usuario')
        .trim()
        .escape()
        .notEmpty(),
    body('mail','Favor Verificar el correo')
        .trim()
        .escape()
        .isEmail()
        .normalizeEmail()
        .notEmpty(),
    body('password','Favor verificar contraseña')
        .isLength({min: 6})
        .trim()
        .escape()
        .custom( (value, {req}) =>  {
            if (value !== req.body.repass){
                console.log( value + ' <> '+ req.body.repass)
                throw new Error('no coinciden las contraseñas')
            }else{
                return value;

            }
        })
],registerOperatorProcess)
router.get('/confirmaccount/:tokenConfirm',confirmaccountprocess )

router.get('/logout', (req, res) => {
    res.render('logout');
})

module.exports = router
