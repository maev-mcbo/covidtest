const { Router } = require('express')
router = Router();

router.get('/', (req, res) => {
     res.redirect('/auth/login');
});

router.get('/cs', (req, res) => {
     
     req.session.usuario =  'mario'
     res.redirect('/')
});

module.exports = router
