const { Router } =require('express')
router = Router();

router.get('/', (req,res) => {
    res.send('hola desde user home');
})

router.get('/addUser', (req,res) => {
    res.send('hola desde add user');
})

router.get('/deleteUser', (req,res) => {
    res.send('hola desde delete user');
})

router.get('/updateUser', (req,res) => {
    res.send('hola desde update user');
})

module.exports=router
