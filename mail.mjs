import nodemailer from 'nodemailer'
import 'dotenv/config'


// Nodemailer configuration
const transporter = nodemailer.createTransport({
  name: 'mail.sobieconference.org',
  host: 'mail.sobieconference.org',
  port: 465, //outgoing port 
  secure: true, // use false for STARTTLS; true for SSL on port 465
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS,
  },
  tls: {
    rejectUnauthorized: false, //needed for sending via bluehost 
  }
});

try {
    
    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: 'barrycumbie@gmail.com',
      subject: 'SOBIE \'25 Registration',
      text: `hi this is Will Cisco`
    };

    // await registrations.insertOne(req.body);
   
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error('Error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
 
  } catch (error) {
    console.error('Error in /register:', error);
  } 