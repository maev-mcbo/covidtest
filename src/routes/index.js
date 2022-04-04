const { Router } = require('express')
router = Router();

router.get('/', (req, res) => {
     res.redirect('/auth/login');
});

router.get('/cs', (req, res) => {
     
     const sesionactiva = req.session 
     res.json(sesionactiva)
});

module.exports = router
