const { Router } =require('express')
const {body} = require('express-validator');
const { orderFrom, orderFromProcess } = require('../controllers/orderController');

router = Router();

router.get('/', orderFrom)
router.post('/', orderFromProcess)


module.exports = router;