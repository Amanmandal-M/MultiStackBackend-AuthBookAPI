const nodemailer = require("nodemailer");

require("dotenv").config();

const sendEmail = async (data) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.GOOGLEKEY
  }
  });

  transporter.sendMail({
    to: `${data.email}`,
    from: process.env.EMAIL_ID,
    subject: "MultiStack Book Backend Services >>",
    html: `${data.body}`,
  })
  .then(()=>console.log('Mail sent successfully'))
  .catch((err)=>console.log("err",err))

}

module.exports = { sendEmail }