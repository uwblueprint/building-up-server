// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const { UserInputError } = require('apollo-server-errors');
const sgMail = require('@sendgrid/mail');
const { SENDGRID_API_KEY } = require('../config/config');
const models = require('../models');

sgMail.setApiKey(SENDGRID_API_KEY);

// TO DO: Edit inivitation email subject, html, and generate email verification link
const createVerificationEmail = id => {
  const user = models.User.findByPk(id);
  if (user == null) {
    throw new UserInputError('User not found');
  }

  const hash = user.verificationHash;

  if (hash == null) {
    // TODO: hash not found?
  }

  return {
    from: 'hongyichen@uwblueprint.org',
    subject: `Verify Email for Building Up`,
    html: 'Thank you for signing up with <strong>Building Up</strong>. Please join using this link: ',
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
