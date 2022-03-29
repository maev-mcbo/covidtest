const nodemailer =require('nodemailer')

const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "f5f3b1819cd6f7",
      pass: "c6dec2891033f7",
    }
  });

  module.exports = (transport)