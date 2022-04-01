const { Router } = require('express')
const { body } = require('express-validator');
const { orderFrom,
    orderFromProcess,
    OrderDetailView,
    readOrders,
    deleteOrder,
    covidResultProcess,
    scanprocess } = require('../controllers/orderController');
const userisvalid = require('../middlewares/userisvalid');

router = Router();

router.get('/',  orderFrom)
router.post('/', [
    body("fname", "").isLength({ min: 3 }),
    body("lname", "").isLength({ min: 3 }),
    body("personalID", "").isNumeric(),
    body("phone", "").notEmpty().isMobilePhone("any"),
    body("gender", "").notEmpty(),
    body("mail", "").notEmpty().isEmail(),
    body("passport ", "").notEmpty(),
    body("bornCountr ", "").notEmpty(),
    body("address ", "").notEmpty(),
    body("testtype ", "").notEmpty(),
    body("originF ", "").notEmpty(),
    body("destf ", "").notEmpty(),
    body("airline ", "").notEmpty(),
    body("idf ", "").notEmpty(),
    body("departuredate ", "").notEmpty(),
    body("arrivaldate ", "").notEmpty(),], orderFromProcess)

router.get('/orderlist',  readOrders)

router.get('/orderdetail/:orderid',  OrderDetailView)

router.get('/deleteorder/:orderid', deleteOrder);

router.post('/covidresult/:id', covidResultProcess);

router.get('/scan/:id', scanprocess);

module.exports = router;


