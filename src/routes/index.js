const { Router } =require('express')
router = Router();

router.get('/', (req,res) => {
    res.send('hola desde home');
})

module.exports=router
