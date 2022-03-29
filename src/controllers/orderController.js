const Order = require("../models/orders")
const {nanoid} = require('nanoid')
const {validationResult} = require('express-validator')
const { json } = require("express/lib/response")

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
             res.redirect('/order/orderlist')        
        } catch (error) {
            console.log(error)
        }


}
const readOrders = async(req,res) =>{
 

    try {
        const orders = await Order.find().lean();
        res.render('orderlist', { orders });
    } catch (error) {
        console.log('error ' + error)
    }

}

const OrderDetailView = async(req, res) => { 
    const id = req.params.orderid
    //res.send( id)
   
     try {
        const ordendata = await  Order.find( {_id: id} ).lean();
       res.render("orderdetail", { ordendata })
    } 
    catch (error) {
        console.log('error ' + error)
    }

}

const deleteOrder = async (req, res) => {
    const { orderid } = req.params
    
//    console.log(id)
    try {
        await Order.findByIdAndDelete(orderid)
        res.redirect('/order/orderlist')
    } catch (error) {
        console.log('error ' + error)
    }
}

const covidResultProcess = async (req, res) => { 
    //const {orderid, result} = req.params
    console.log('ESTE ES EL ID DE LA ORDEN' + req.params.id)
    console.log(' ESTE ES EL RESULTADO' + req.body.covidresult)

    const id =  req.params.id
    const covidresulta = req.body.covidresult

    try {
        const newcovidresult = await Order.findOne({_id: id})
        console.log('orden encontrada '+ newcovidresult)
       
        
        newcovidresult.testresult = covidresulta
       // tokenConfirmExist.tokenConfirm = null

        await newcovidresult.save()
       
        res.redirect( "/order/orderdetail/"+ req.params.id)
            
        } catch (error) {
                console.log(error)
        }
        
    //res.send(req.body)
}

module.exports = {
    orderFrom,
    orderFromProcess,
    readOrders,
    OrderDetailView,
    deleteOrder,
    covidResultProcess
    
}