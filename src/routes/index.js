const { Router } = require('express')
router = Router();

router.get('/', (req, res) => {
     res.redirect('/order/orderlist');
});

router.get('/cs', (req, res) => {
     
     req.session.usuario =  'mario'
     res.redirect('/')
});

module.exports = router
