const { Router } = require('express')
const { body } = require('express-validator');
const { orderFrom,
    orderFromProcess,
    OrderDetailView,
    readOrders,
    deleteOrder,
    covidResultProcess,
    scanprocess,
    paymentprocess   } = require('../controllers/orderController');
const userisvalid = require('../middlewares/userisvalid');

router = Router();

router.get('/',  orderFrom)


router.post('/', [
    body("fname", "Minimo 3 caracteres").isLength({ min: 3 }),
    body("lname", "Minimo 3 caracteres").isLength({ min: 3 }),
    body("personalID", "Cedula invalida").isNumeric(),
    body("phone", "telefono invalido").notEmpty().isMobilePhone("any"),
    body("gender", "Genero vacio").notEmpty(),
    body("mail", "No es un correo").notEmpty().isEmail(),
    body("passport ", "Pasaporte no puede estar vacio").notEmpty(),
    body("bornCountr ", "fecha no puede estar vacia").notEmpty(),
    body("address ", "Direccion no puede estar vacia").notEmpty(),
    body("testtype ", "Debe seleccionar un tipo de prueba").notEmpty(),
    body("originF ", "El pais de origen no puede estar vacio").notEmpty(),
    body("destf ", "El pais de destino no puede estar vacio").notEmpty(),
    body("airline ", "Seleccione una Aerolinea").notEmpty(),
    body("idf ", "Numero de vuelo no puede estar vacio").notEmpty(),
    body("departuredate ", "Seleccione una fecha de salida").notEmpty(),
    body("arrivaldate ", "Seleccione una fecha de llegada").notEmpty(),], orderFromProcess)

router.get('/orderlist/:filter?',  readOrders)

router.get('/orderdetail/:orderid', OrderDetailView)

router.get('/deleteorder/:orderid', deleteOrder);

router.post('/covidresult/:id', covidResultProcess);

router.get('/scan/:id', scanprocess);
router.post('/payment/:id', paymentprocess);

module.exports = router;


