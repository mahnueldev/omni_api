const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const dotenv = require('dotenv');
const path = require('path');



if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.development.local' });
} else {
  dotenv.config({ path: '.env.production.local' });
}

const sendWelcomeEmail = async (firstName, email) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILER_SERVICE,
    port: 465,
    secure: true, // use TLS
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS,
    },
   
  });

  // Set up email template options
  const handlebarsOptions = {
    viewEngine: {
      partialsDir: path.resolve('./public/mailer/partials'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./public/mailer/email'),
    extName: '.hbs',
  };

  // Use the nodemailer-express-handlebars plugin with our transporter and options
  transporter.use('compile', hbs(handlebarsOptions));

  // Set up email options
  const mailOptions = {
    from: 'Omni <hello@mahnuel.com>',
    to: email,
    subject: 'Omni: Education at its best',
    template: 'welcome', // Use the 'apikey' template we defined in the views folder
    context: {
      
      firstName: firstName
    },
    
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Message email sent');
  } catch (err) {
    console.error('Error sending email:', err);
  }
};

const sendOTPEmail = async (firstName, email, plainOTP) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILER_SERVICE,
    port: 465,
    secure: true, // use TLS
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS,
    },
  });

  // Set up email template options
  const handlebarsOptions = {
    viewEngine: {
      partialsDir: path.resolve('./public/mailer/partials'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./public/mailer/email'),
    extName: '.hbs',
  };

  // Use the nodemailer-express-handlebars plugin with our transporter and options
  transporter.use('compile', hbs(handlebarsOptions));

  // Set up email options
  const mailOptions = {
    from: 'Omni <hello@mahnuel.com>',
    to: email,
    subject: 'RESET PASSWORD!',
    template: 'otpReset',
    context: {
      plainOTP: plainOTP,
      firstName: firstName

    },
    attachments: [
      {
        filename: 'flavordash.png',
        path: path.resolve('./public/assets/flavordash.png'),
        cid: 'flavordash',
        contentDisposition: 'inline',
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Reset code email sent');
  } catch (err) {
    console.error('Error sending Reset code email:', err);
  }
};


const sendURLEmail = async (firstName, email, resetURL) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILER_SERVICE,
    port: 465,
    secure: true, // use TLS
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS,
    },
  });

  // Set up email template options
  const handlebarsOptions = {
    viewEngine: {
      partialsDir: path.resolve('./public/mailer/partials'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./public/mailer/email'),
    extName: '.hbs',
  };

  // Use the nodemailer-express-handlebars plugin with our transporter and options
  transporter.use('compile', hbs(handlebarsOptions));

  // Set up email options
  const mailOptions = {
    from: 'Flavor Dash <hello@mahnuel.com>',
    to: email,
    subject: 'RESET PASSWORD!',
    template: 'urlReset',
    context: {
      resetURL: resetURL,
      firstName: firstName

    },
    attachments: [
      {
        filename: 'flavordash.png',
        path: path.resolve('./public/assets/flavordash.png'),
        cid: 'flavordash',
        contentDisposition: 'inline',
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Reset code email sent');
  } catch (err) {
    console.error('Error sending Reset code email:', err);
  }
};


module.exports = { sendWelcomeEmail, sendOTPEmail, sendURLEmail };
