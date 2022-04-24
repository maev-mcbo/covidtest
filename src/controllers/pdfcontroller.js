const Order = require("../models/orders")
const puppeteer = require("puppeteer");
require('dotenv').config();



const pdfmaker = async (req, res) =>{
   
    const id = req.params.id
    const data = await Order.findOne({ _id: id }).lean();
    data.url= process.env.SCANURL + id

    console.log(data);
    res.render("pdf",{data, layout: 'clean'})
}

const pdf = async (req, res) =>{
 const id = req.params.id
const url = `http://localhost:5000/pdfmaker/${id}`
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox','--disable-setuid-sandbox']
    });
    const webPage = await browser.newPage();
    await webPage.goto(url, {
        waitUntil: "networkidle0",
    });
    
    const pdf = await webPage.pdf({
        printBackground: true,
        format: "a4",
        landscape: true,
    });
    await browser.close();
    res.contentType("application/pdf");
    res.send(pdf);
}

module.exports={
    pdfmaker,
    pdf
}