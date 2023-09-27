const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
// const { sendWelcomeEmail } = require('../../utils/authMailer');
const dotenv = require('dotenv');
const { User } = require('../../database/models');


if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.development.local' });
} else {
  dotenv.config({ path: '.env.production.local' });
}

const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, password } = req.body;

  try {
    let user = await User.findOne({ where: { email } });

    if (user) {
      if (user.archivedAt !== null) {
   
        return res.redirect(process.env.USER_RECOVERY);
      } else {
        return res.status(401).json({ msg: 'User already exists' });
      }
    }

    

    const salt = await bcrypt.genSalt(10);
    user = new User({
      firstName,
      lastName,
      email,
      password,
    });

    user.password = await bcrypt.hash(password, salt);

    // Attempt to send the welcome email
    // try {
    //   await sendWelcomeEmail(firstName, email);
    // } catch (err) {
    //   console.error('Error sending welcome email:', err.message);
    //   return res.status(500).send('Error sending welcome email');
    // }

    // If the email was sent successfully, save the user to the database
    await user.save();
    res.json({ msg: 'User created successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { createUser  };