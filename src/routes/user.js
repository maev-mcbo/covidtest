const { Router } =require('express')
const {readUsers, addUser, deleteUser, updateUser} = require('../controllers/userControllers')
router = Router();

router.get('/', readUsers);

router.get('/adduser', (req, res) => {
    res.render('adduser')
});

router.post('/adduser',addUser);

router.get('/deleteUser/:id', deleteUser);

router.get('/updateUser/:id', (req, res) => {
    res.render('updateuser')
});

router.post('/updateuser/:id', updateUser);

module.exports=router
