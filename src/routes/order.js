const { Router } =require('express')
const {body} = require('express-validator');
const { orderFrom, 
    orderFromProcess,
    readorders } = require('../controllers/orderController');
const userisvalid = require('../middlewares/userisvalid');

router = Router();

router.get('/', userisvalid,orderFrom)
router.post('/',userisvalid, orderFromProcess)
router.get('/orderlist', userisvalid, readorders)


module.exports = router;