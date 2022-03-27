const { Router } = require('express')
router = Router();

router.get('/', (req, res) => {
     res.json(req.session.usuario || 'sin sesion');
});

router.get('/cs', (req, res) => {
     
     req.session.usuario =  'mario'
     res.redirect('/')
});

module.exports = router
