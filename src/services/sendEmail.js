// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
const { SENDGRID_API_KEY } = require('../config/config');

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async msg => {
  return sgMail
    .send(msg)
    .then(() => {
      console.log(`Email sent to ${msg.to}`);
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
};

exports.sendEmail = sendEmail;
