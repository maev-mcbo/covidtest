const Order = require("../models/orders")
const { validationResult } = require('express-validator')
const qrcode = require("qrcode")
const PDFDocument = require('pdfkit')
const transport = require('../nodemailer/transport')
const { ConsoleMessage } = require("puppeteer")


const readOrders = async (req, res) => {

    const filtro = req.query.filter
    // const id = req.query.id
    console.log(' el filtro es:     ' + filtro)

    switch (filtro) {
        case "all":
           //console.log('pos')
            try {
                const orders = await Order.find().lean();
                orders.reverse()
                res.render('orderlist', { orders });
            } catch (error) {
                req.flash('mensajes', [{ msg: error.message }])
                return res.redirect('orderlist')
            } break;
        case "pos":
            //console.log('pos')
            try {
                const orders = await Order.find({ testresult: "positivo" }).lean();
                orders.reverse()
                res.render('orderlist', { orders });
            } catch (error) {
                req.flash('mensajes', [{ msg: error.message }])
                return res.redirect('orderlist')
            } break;

        case "neg":
            //console.log('neg')
            try {
                const orders = await Order.find({ testresult: "Negativo" }).lean();
                orders.reverse()
                res.render('orderlist', { orders });
            } catch (error) {
                req.flash('mensajes', [{ msg: error.message }])
                return res.redirect('orderlist')
            } break;
        case "pen":
         //   console.log('pen')
            try {
                const orders = await Order.find({ testresult: "pendiente" }).lean();
                orders.reverse()
                res.render('orderlist', { orders });
            } catch (error) {
                req.flash('mensajes', [{ msg: error.message }])
                return res.redirect('orderlist')
            } break;
        case "anulado":
         console.log("Filtro seleecionado: "+ filtro)
            try {
                const orders = await Order.find({ testresult: "Anulado" }).lean();
                orders.reverse()
                res.render('orderlist', { orders });
            } catch (error) {
                req.flash('mensajes', [{ msg: error.message }])
                return res.redirect('orderlist')
            } break;
        default:
            console.log('today')
            try {
                // const hoy = new Date().toISOString().split('T')[0]
                // console.log(hoy)
                var now = new Date();
                var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                console.log(startOfToday)
                const orders = await Order.find({ createdAt: { $gte: startOfToday } }).lean()
                orders.reverse()
                console.log(" hay " + orders.length + " ordenes");
                // res.json(orders)
                //console.log(orders);
                res.render('orderlist', { orders });
            } catch (error) {
                req.flash('mensajes', [{ msg: error.message }])
                return res.redirect('orderlist')
            }

            break;
    }

}



const orderFrom = (req, res) => {
    res.render('order')
}





const orderFromProcess = async (req, res) => {

    const errors = validationResult(req)
    if (errors.isEmpty()) {
        req.flash('mensajes', errors.array())
        return res.redirect('/order')
    }

    const data = req.body
    console.log(data)
    try {
        const newOrder = await new Order(data)
        newOrder.save()
        req.flash('mensajes', [{ msg: "Se la creado una orden Exitosamente" }])
        res.redirect('/order/orderlist')

    } catch (error) {
        req.flash('mensajes', [{ msg: error.message }])
        return res.redirect('/order/orderlist')
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
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash('mensajes', errors.array())
        return res.redirect('/order/orderlist')
    }

    const { orderid } = req.params

    try {
        await Order.findByIdAndDelete(orderid)
        req.flash('mensajes', [{ msg: `Orden ${orderid} Eliminada Exitosamente` }])
        res.redirect('/order/orderlist')


    } catch (error) {
        req.flash('mensajes', [{ msg: error.message }])
        return res.redirect('/order/orderlist')
    }
}

const covidResultProcess = async (req, res) => {
    const id = req.params.id
    const covidresulta = req.body.covidresult

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash('mensajes', errors.array())
        return res.redirect('/order/orderdetail' + id)
    }
    console.log('ESTE ES EL ID DE LA ORDEN' + req.params.id)
    console.log(' ESTE ES EL RESULTADO' + req.body.covidresulta)



    try {
        const newcovidresult = await Order.findOne({ _id: id })
        console.log('orden encontrada ' + newcovidresult)
        newcovidresult.testresult = covidresulta
        await newcovidresult.save()
        console.log('data guardada')

        let info = await transport.sendMail({
            from: 'testmail@gmail.com',
            to: newcovidresult.mail,
            subject: 'resultado',
            html: `<a href="${process.env.SCANURL + newcovidresult._id}">
                     ver tu resultado aqui</a>`,
            attachments: [{
                filename: `${newcovidresult._id + '_' + newcovidresult.fname + '_' + newcovidresult.lname}.pdf`,
                path: `${process.env.SCANURL + newcovidresult._id}`
            }
            ]
        })
        console.log("Message sent: %s", info.messageId);



        req.flash('mensajes', [{ msg: `Resultado a sido cambiado a ${covidresulta} y correo enviado a ${newcovidresult.mail}` }])

        res.redirect('/order/orderdetail/' + id)

    } catch (error) {
        req.flash('mensajes', [{ msg: error.message }])
        return res.redirect('/order/orderdetail/' + id)
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
    const pcrdesc = "Esta prueba PCR de COVID-19 detecta el material genético del virus mediante una técnica de laboratorio llamada reacción en cadena de la polimerasa."
    const antigenodesc = 'Este prueba de Antigeno detecta, de manera rápida, mediante una muestra respiratoria, la presencia del antígeno para así poder determinar si tus síntomas son debidos a la infección por SARS-Cov-2.'
    console.log("pruebas");
    if (dataorder.testtype != 'pcr') {
        console.log(' antigeno DESC')
        var descripcion = antigenodesc
    } else {
        console.log('PCR DESCs ')
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
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"')
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

const paymentprocess = async (req, res) => {

    const id = req.params.id
        const { paymenteAmauntform, paymenteStatusform,currency } = req.body

    console.log('ESTE ES EL ID ' + id)
    console.log('CANTIDAD A PAGAR ' + paymenteAmauntform + ' ESTADO DEL PAGO ' + paymenteStatusform + " El tipo de moneda es: "+ currency)
    try {
        const dataorder = await Order.findOne({ _id: id })
        dataorder.paymentAmaunt = paymenteAmauntform
        dataorder.paymentStatus = paymenteStatusform
        dataorder.currency = currency
        await dataorder.save()
        res.redirect(`/order/orderdetail/${id}`)

    } catch (error) {
        console.log(error)
    }


}



module.exports = {
    orderFrom,
    orderFromProcess,
    readOrders,
    OrderDetailView,
    deleteOrder,
    covidResultProcess,
    scanprocess,
    paymentprocess

}