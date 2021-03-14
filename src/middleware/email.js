// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const testMsg = {
  to: 'hongyigma@gmail.com', // Change to your recipient
  from: 'hongyichen@uwblueprint.org', // This is currently the verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

const createTeamInviteMessage = teamId => {
  return {
    from: 'hongyichen@uwblueprint.org',
    subject: `Invitation to join ${teamId}`,
    text: 'hello hey whats up join this with this link',
    html: '<strong> nice </strong>',
  };
};

// TO DO: Expand this to send to multiple users at once, probably just looping through list of msgs
const sendEmail = msg => {
  sgMail
    .send(msg)
    .then(() => {
      console.log(`Email sent to ${msg.to}`);
    })
    .catch(error => {
      console.error(error);
    });
};

// I think we should probably specify somewhere in the message for teamId
// presumably, it would be in the message which is passed into here
const inviteTeam = (emails, teamId) => {
  const message = createTeamInviteMessage(teamId);
  emails.forEach(email => {
    const emailBody = { to: { email }, ...message };
    sendEmail(emailBody);
  });
};

sendEmail(testMsg);

export default sendEmail;
