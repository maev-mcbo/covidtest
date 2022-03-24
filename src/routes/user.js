const { Router } =require('express')
const {readUsers, addUser} = require('../controllers/userControllers')
router = Router();

router.get('/', readUsers);

router.get('/adduser',addUser);
router.post('/adduser',addUser);

router.get('/deleteUser', (req,res) => {
    res.send('hola desde delete user');
})

router.get('/updateUser', (req,res) => {
    res.send('hola desde update user');
})

module.exports=router
