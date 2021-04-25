// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
const { SENDGRID_API_KEY, CLIENT_URL, EMAIL_FROM_ADDRESS, EMAIL_REPLYTO_ADDRESS } = require('../config/config');

sgMail.setApiKey(SENDGRID_API_KEY);

const createVerificationEmail = hash => {
  if (hash == null) {
    throw new Error('Null Hash');
  }

  const inviteUrl = `${CLIENT_URL}/verify/${hash}`;

  return {
    from: EMAIL_FROM_ADDRESS,
    subject: `Verify your email for Raising the Roof's Toque Campaign`,
    replyTo: EMAIL_REPLYTO_ADDRESS,
    html: `Thank you for signing up! Please verify your email <a href="${inviteUrl}">here</a>.`,
  };
};

const sendEmail = async msg => {
  return sgMail
    .send(msg)
    .then(() => {
      // eslint-disable-next-line no-console
      console.log(`Email sent to ${msg.to}`);
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.error(error);
      throw error;
    });
};

exports.createVerificationEmail = createVerificationEmail;
exports.sendEmail = sendEmail;
