const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { User } = require('../../database/models');

if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.development.local' });
} else {
  dotenv.config({ path: '.env.production.local' });
}

const login = async (req, res) => {
  const cookies = req.cookies;
  console.log(`cookie available at login: ${JSON.stringify(cookies)}`);
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ msg: 'Username and password are required.' });

  const foundUser = await User.findOne({ where: { email } });

  if (!foundUser) {
    return res.status(400).json({ msg: 'Invalid email or password' });
  }

  const isPasswordMatch = await bcrypt.compare(password, foundUser.password);

  if (!isPasswordMatch) {
    return res.status(400).json({ msg: 'Invalid email or password' });
  } else if (isPasswordMatch) {
    // Generate the access token
    const accessToken = jwt.sign(
      {
        userInfo: {
          email: foundUser.email,
          // Add any other user-related data you need here
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '2hr' }
    );

    // Generate the refresh token
    const newRefreshToken = jwt.sign(
      { email: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '6hr' }
    );

    let newRefreshTokenArray =
    !cookies?.jwt
        ? foundUser.refreshToken
        : foundUser.refreshToken.filter(rt => rt !== cookies.jwt);


if (cookies?.jwt) {
      const refreshToken = cookies.jwt;
      const foundToken = await User.findOne({
        where: {
          refreshToken: refreshToken,
        },
      });

      // Detected refresh token reuse!
      if (!foundToken) {
        console.log('attempted refresh token reuse at login!');
        // clear out ALL previous refresh tokens
        newRefreshTokenArray = [];
      }

      res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      });
    }

    // save refresh token with current user
    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    const result = await foundUser.save();
    console.log(result);

    // Set the refresh token as a secure HTTP-only cookie
    res.cookie('jwt', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000, // Set the expiration time for the cookie
    });

    // Respond with a success message and access token
    res.json({ msg: 'Logged in successfully', accessToken });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { login };
