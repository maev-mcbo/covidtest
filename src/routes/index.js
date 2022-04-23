const { Router } = require('express')
const { dashboard } = require('../controllers/dasboardController')
const {pdf, pdfmaker} = require("../controllers/pdfcontroller")
router = Router();

router.get('/', (req, res) => {
     res.redirect('dashboard');
});

router.get('/cs', (req, res) => {
     
     const sesionactiva = req.session 
     res.json(sesionactiva)
});

router.get('/pdfmaker/:id?', pdfmaker);
router.get('/pdf/:id?' ,pdf);




router.get('/dashboard', dashboard);


module.exports = router
