const { Router } = require('express')
router = Router();


router.get('/login', (req, res) => {
    res.render('login');

})

router.post('/form', (req, res) => {
    res.json(req.body);
})

router.get('/singout', (req, res) => {
    res.send('hola desde singout');
})

module.exports = router
