const nodemailer = require("nodemailer");
let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nodejstestreply@gmail.com',
        pass: '@rihantFLAT202'
    }
  });
  const sendEmail = async (email, subject, text) => {
    try {
      let mailDetails = {
        from: "nodejstestreply@gmail.com",
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
  
      console.log("email sent sucessfully");
    } catch (error) {
      console.log(error, "email not sent");
    }
  };
  
  module.exports = sendEmail;