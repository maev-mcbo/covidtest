const { Router } =require('express')
router = Router();

router.get('/login', (req,res) => {
    res.send('hola desde login');
})

router.get('/logout', (req,res) => {
    res.send('hola desde logout');
})

router.get('/singout', (req,res) => {
    res.send('hola desde singout');
})

module.exports=router
