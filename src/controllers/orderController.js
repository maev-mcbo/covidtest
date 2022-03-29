const Order = require("../models/orders")
const {nanoid} = require('nanoid')
const {validationResult} = require('express-validator')

const orderFrom = (req, res) => {
    res.render('order')
}

const orderFromProcess = async(req, res)=> {

        const data = req.body
        console.log(data)
        try {
            
            const newOrder = await new Order(data)
            //res.json(newOrder)
             newOrder.save()            
        } catch (error) {
            console.log(error)
        }


}
const readorders = async(req,res) =>{
 

    try {
        const orders = await Order.find().lean();
        res.render('orderlist', { orders });
    } catch (error) {
        console.log('error ' + error)
    }

}




module.exports = {
    orderFrom,
    orderFromProcess,
    readorders
    
}