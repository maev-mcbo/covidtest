const Order = require("../models/orders")
const qrcode = require("qrcode")
const PDFDocument = require('pdfkit')
const orderFrom = (req, res) => {
    res.render('order')
}

const orderFromProcess = async (req, res) => {

    const data = req.body
    console.log(data)
    try {
        const newOrder = await new Order(data)
        newOrder.save()
    } catch (error) {
        console.log(error)
    }
    res.redirect('/order/orderlist')

}
const readOrders = async (req, res) => {


    try {
        const orders = await Order.find().lean();
        res.render('orderlist', { orders });
    } catch (error) {
        console.log('error ' + error)
    }

}

const OrderDetailView = async (req, res) => {
    const id = req.params.orderid
    //res.send( id)


    try {
        const ordendata = await Order.find({ _id: id }).lean();

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
    console.log(' ESTE ES EL RESULTADO' + req.body.covidresulta)

    const id = req.params.id
    const covidresulta = req.body.covidresult

    try {
        const newcovidresult = await Order.findOne({ _id: id })
        console.log('orden encontrada ' + newcovidresult)

        newcovidresult.testresult = covidresulta
        // tokenConfirmExist.tokenConfirm = null

        await newcovidresult.save()

        res.redirect("/order/orderdetail/" + req.params.id)

    } catch (error) {
        console.log(error)
    }

    //res.send(req.body)
}
const scanprocess = async (req, res) => {

    const id = req.params.id
    const dataorder = await Order.findOne({ _id: id })
    console.log('hola soy la data ' + dataorder)
    const qrpdf = await qrcode.toDataURL(`${process.env.SCANURL + id}`)
    const dob = dataorder.dob.slice(0, 4)
    const hoy = new Date().getUTCFullYear()
    const edad = hoy - dob
    const pcrdesc ="Esta prueba PCR de COVID-19 detecta el material genético del virus mediante una técnica de laboratorio llamada reacción en cadena de la polimerasa." 
    const antigenodesc = 'Este prueba de Antigeno detecta, de manera rápida, mediante una muestra respiratoria, la presencia del antígeno para así poder determinar si tus síntomas son debidos a la infección por SARS-Cov-2.'
    
     if(dataorder.testtype!='pcr'){
        console.log( ' antigeno DESC')
        var descripcion = antigenodesc
     }else{
        console.log( 'PCR DESCs ')
        var descripcion = pcrdesc

     }

    const doc = new PDFDocument({
        bufferPages: true,
        font: 'Helvetica',
        size: 'A4',
        margin: 20,
        layout: 'landscape',
        displayTitle: "prueba",
    })
    let filename = dataorder._id
    // Stripping special characters
    filename = encodeURIComponent(filename) + '.pdf'
    // Setting response to 'attachment' (download).
    // If you use 'inline' here it will automatically open the PDF
    //res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"')
    res.setHeader('Content-type', 'application/pdf')
    //const content = dataorder
    doc.image(`${qrpdf}`, 735, 40, {
        width: 90,
        height: 90,
        align: 'center'
    })

    doc.image(`src/images/logo.jpg`, 20, 50, {
        height: 50,
        align: 'center'
    })

    //  doc.rect(0, 0, 1000 ,30).fill("red")
    // header
    doc.rect(0, 0, 1000, 30).fillAndStroke('teal');
    doc.fill('#fff').stroke();
    doc.fontSize(16);
    doc.text("SISTEMA DE GESTION PARA PRUEBAS COVID", 25, 10, { lineBreak: false, align: 'center' });

    doc.rect(0, 565, 1000, 30).fillAndStroke('teal');
    doc.fill('#000').stroke();
    doc.rect(320, 150, 500, 250).fillAndStroke('#fff', '#000');
    //doc.fill('#fff').stroke();
    doc.fontSize(16);
    doc.moveDown(6)
    doc.fontSize(8).text(`LADO IZQUIERDO`, 50).fillColor('#000');
    doc.fontSize(12).text(`Nombre: | First Name:`);
    doc.fontSize(16).text(`${dataorder.fname.toUpperCase()}`).moveDown(0.5);

    doc.fontSize(12).text(`Apellido: | Last Name:`);
    doc.fontSize(16).text(` ${dataorder.lname.toUpperCase()} `).moveDown(0.5);

    doc.fontSize(12).text(`Pasaporte: | Passport:`);
    doc.fontSize(16).text(`${dataorder.passport.toUpperCase()}`).moveDown(0.5);

    doc.fontSize(12).text(`Cedula: | ID:`);
    doc.fontSize(16).text(`${dataorder.personalID.toUpperCase()}`).moveDown(0.5);

    doc.fontSize(12).text(`Genero: | Gender:`);
    doc.fontSize(16).text(`${dataorder.gender.toUpperCase()}`).moveDown(0.5);

    doc.fontSize(12).text(`Edad:`);
    doc.fontSize(16).text(`${edad}`).moveDown(0.5);

    doc.fontSize(12).text(`Telefono:`);
    doc.fontSize(16).text(`${dataorder.phone}`).moveDown(0.5);

    doc.fontSize(12).text(`Dirección:`);
    doc.fontSize(16).text(`${dataorder.address.toUpperCase()}`).moveDown(0.5);
    doc.fontSize(12).text(`Tipo de Prueba:`);
    doc.fontSize(16).text(`${dataorder.testtype.toUpperCase()}`).moveDown(0.5);

    //doc.fontSize(8).text(`LADO DERECHO`, 600,200); 

    doc.fontSize(20).text(`RESULTADO: `, 680, 160);
    doc.fontSize(50).text(`${dataorder.testresult.toUpperCase()}`, 480, 190, {
        width: 410,
        align: 'center'
    });
    //doc.fontSize(50).text(`NEGATIVO`, 555,190,{width: 410,
    //  align: 'center'});
   
    doc.fontSize(12).text(`DESCRIPCION DE LA PRUEBA`, 625, 240);
    doc.fontSize(16).text(`${descripcion}`).moveDown(0.5);
    
    //doc.fontSize(16).text(`${dataorder.testtype.toUpperCase()}`, { align: 'rigth' }).moveDown(0.5);

    doc.fill('#fff').stroke();
    doc.fontSize(16);
    doc.text("DESARROLLADO POR MARIO ECHEVERRIA", 25, 576, { lineBreak: false, align: 'center' });





    doc.pipe(res)
    doc.end()
}





module.exports = {
    orderFrom,
    orderFromProcess,
    readOrders,
    OrderDetailView,
    deleteOrder,
    covidResultProcess,
    scanprocess

}