// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
const { SENDGRID_API_KEY, CLIENT_URL, EMAIL_FROM_ADDRESS, EMAIL_REPLYTO_ADDRESS } = require('../config/config');
const { DASHBOARD_ROOT_PATH } = require('../constants/client-routes');

const VERIFY_EMAIL_TEMPLATE_ID = 'd-9446d43004094066ab95ae2f9e1ca623';

sgMail.setApiKey(SENDGRID_API_KEY);

const emailBase = {
  from: {
    name: 'Raising the Roof / Chez Toit',
    email: EMAIL_FROM_ADDRESS,
  },
  replyTo: EMAIL_REPLYTO_ADDRESS,
};

const createVerificationEmail = (name, hash) => {
  if (hash == null) {
    throw new Error('Null Hash');
  }

  const verifyEmailUrl = `${CLIENT_URL}/${DASHBOARD_ROOT_PATH}/verify/${hash}`;

  return {
    template_id: VERIFY_EMAIL_TEMPLATE_ID,
    dynamic_template_data: {
      verifyEmailUrl,
      name,
    },
  };
};

const sendEmail = async msg => {
  return sgMail
    .send({ ...emailBase, ...msg })
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
