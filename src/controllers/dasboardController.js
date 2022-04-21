const Order = require("../models/orders");


const dashboard = async (req, res) => {
    const data = []
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    console.log(startOfToday)

    data.total =  (await Order.find({ createdAt: { $gte: startOfToday } }).lean()).length
    data.pendientes =  (await Order.find({ testresult: "pendiente", createdAt: { $gte: startOfToday } }).lean()).length
    data.negativas =  (await Order.find({ testresult: "Negativo", createdAt: { $gte: startOfToday } }).lean()).length
    data.positivas =  (await Order.find({ testresult: "Positivo", createdAt: { $gte: startOfToday } }).lean()).length
    data.anuladas =  (await Order.find({ testresult: "Anulado", createdAt: { $gte: startOfToday } }).lean()).length
    console.log(data);


    res.render('dashboard', { data })


}


module.exports = {
    dashboard
}