
const sgMail = require('@sendgrid/mail');

const sendGridAPIKey = process.env.SENDGRID_API_KEY

sgMail.setApiKey(sendGridAPIKey);

const sendWelcomeEmail = (email, name) => {
  const msg = {
    to: email,
    from: 'anshupratapsingh32391@gmail.com',
    subject: 'Welcome To Task Manager App',
    text: `Hey ${name} It feels great to have you on board`

  };
  sgMail.send(msg) .then(() => {console.log('sent')}, error => {
        console.error(error);

        if (error.response) {
          console.error(error.response.body)
        }
  });
}

const sendByeEmail = (email, name) => {
  const msg = {
    to: email,
    from: 'anshupratapsingh32391@gmail.com',
    subject: 'Why are you Leaving ?',
    text: `Hey ${name} Please tell us what you deleted your account`

  };
  sgMail.send(msg) .then(() => {console.log('sent')}, error => {
        console.error(error);

        if (error.response) {
          console.error(error.response.body)
        }
  });
}

module.exports = {
  sendWelcomeEmail,
  sendByeEmail
}
