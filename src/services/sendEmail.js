// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const { UserInputError } = require('apollo-server-errors');
const sgMail = require('@sendgrid/mail');
const { SENDGRID_API_KEY, CLIENT_URL } = require('../config/config');
const models = require('../models');

sgMail.setApiKey(SENDGRID_API_KEY);

// TO DO: Edit inivitation email subject, html, and generate email verification link
const createVerificationEmail = hash => {
  if (hash == null) {
    throw new Error('Null Hash');
  }

  const inviteUrl = `${CLIENT_URL}/verify/${hash}`;

  return {
    from: 'hongyichen@uwblueprint.org',
    subject: `Verify your email for Raising the Roof's Toque Campaign`,
    html: `Thank you for signing up! Please verify your email with this link: <a href="${inviteUrl}">${inviteUrl}</a>`,
  };
};

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

exports.createVerificationEmail = createVerificationEmail;
exports.sendEmail = sendEmail;
