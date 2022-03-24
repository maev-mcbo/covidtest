const fs = require('fs');

const { Router } =require('express')
router = Router();


router.post('/login', (req,res) => {
    const data = req.body
    const {fname, lname }= req.body
    if ( !fname || !lname ) return res.send('alguno de los campos estan vacios')
    res.send(`Los datos son` + JSON.stringify(data))
    
       console.log(data);
  
})

router.get('/logout', (req,res) => {
    res.send('hola desde logout');
})

router.get('/singout', (req,res) => {
    res.send('hola desde singout');
})

module.exports=router
