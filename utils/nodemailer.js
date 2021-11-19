const nodemailer = require("nodemailer");
require('dotenv').config();
let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
  });
  const sendEmail = async (email, subject, text) => {
    try {
      let mailDetails = {
        from: process.env.MAIL_USER,
        to: email,
        subject: subject,
        text: "",
        html: `<h3> ${text} `,
      };
      mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
          console.log(err);
        
        } else {
          console.log("Email sent successfully");
          
        }
      });
      console.log("Email sent successfully1");
    } catch (error) {
      console.log(error, "email not sent");
    }
  };
  
  module.exports = sendEmail;