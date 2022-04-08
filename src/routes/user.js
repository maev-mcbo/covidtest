const { Router } =require('express')
const {body} = require('express-validator')
router = Router();
const userisvalid = require('../middlewares/userisvalid');

const {readUsers, 
    addUserProcess,
        deleteUser,
        updateUser,
        addUserForm,
        updateUserForm,
        readcne
    } = require('../controllers/userControllers');

router.get('/', readUsers);

router.get('/adduser',  addUserForm);
router.post('/adduser',[
    body("fname","Nombre invalido").trim().isLength({min: 3}),
    body("lname",'Apellido invalido').trim().isLength({min: 3}),
    body("bdate",'Fecha invalida').notEmpty().trim().isDate(),
    body("mail",'Correo Invalido').isEmail(),
    body("passport",'Pasaporte no puede estar vacio.').notEmpty().trim()
],addUserProcess);

router.get('/deleteUser/:id', deleteUser);
router.get('/updateUser/:id', updateUserForm);
router.post('/updateuser/:id', updateUser);

router.get('/cne/:cedula', readcne);



module.exports=router
