const { Router } = require('express')
router = Router();


router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/form', (req, res) => {
    res.json(req.body);
})

router.get('/logout', (req, res) => {
    res.render('logout');
})

module.exports = router
