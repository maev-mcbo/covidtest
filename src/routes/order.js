const { Router } = require('express')
const { body } = require('express-validator');
const { orderFrom,
    orderFromProcess,
    OrderDetailView,
    readOrders,
    deleteOrder,
    covidResultProcess } = require('../controllers/orderController');
const userisvalid = require('../middlewares/userisvalid');

router = Router();

router.get('/', userisvalid, orderFrom)
router.post('/', userisvalid, [
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

router.get('/orderlist', userisvalid, readOrders)

router.get('/orderdetail/:orderid', userisvalid, OrderDetailView)

router.get('/deleteorder/:orderid',userisvalid, deleteOrder);

router.post('/covidresult',userisvalid, covidResultProcess);


module.exports = router;


