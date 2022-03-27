const { Router } = require('express')
router = Router();
const {
    loginOperatorForm,
    registerOperatorFrom,
    registerOperatorProcess,
    loginOperatorProcess,
    confirmaccountprocess
} = require('../controllers/authController')


router.get('/login', loginOperatorForm)
router.post('/login',loginOperatorProcess)

router.get('/singup', registerOperatorFrom)
router.post('/singup',registerOperatorProcess)
router.get('/confirmaccount/:tokenConfirm',confirmaccountprocess )

router.get('/logout', (req, res) => {
    res.render('logout');
})

module.exports = router
