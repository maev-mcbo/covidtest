const { Router } = require('express')
const { dashboard } = require('../controllers/dasboardController')
router = Router();

router.get('/', (req, res) => {
     res.redirect('dashboard');
});

router.get('/cs', (req, res) => {
     
     const sesionactiva = req.session 
     res.json(sesionactiva)
});


router.get('/dashboard', dashboard);


module.exports = router
