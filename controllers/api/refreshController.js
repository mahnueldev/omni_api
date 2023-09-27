const { User } = require('../../database/models');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

  let decodedToken;

  try {
    decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    console.error(err.message);
    return res.sendStatus(403); // Forbidden
  }

  const foundUser = await User.findOne({ where: { email: decodedToken.email } });

  if (!foundUser) {
    console.log('attempted refresh token reuse!');
    
    try {
      const hackedUser = await User.findOne({
        where: { email: decodedToken.email },
      });
  
      if (hackedUser) {
        // Filter out expired refresh tokens
        hackedUser.refreshToken = hackedUser.refreshToken.filter(rt => {
          try {
            jwt.verify(rt, process.env.REFRESH_TOKEN_SECRET);
            return true; // Valid token
          } catch (err) {
            return false; // Expired token
          }
        });
        
        const result = await hackedUser.save();
        console.log(result);
      }
    } catch (err) {
      console.error(err.message);
      return res.sendStatus(500); // Internal Server Error
    }
    
    return res.sendStatus(403); // Forbidden
  }

  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );

  // At this point, the refresh token is valid
  const accessToken = jwt.sign(
    {
      userInfo: {
        email: decodedToken.email,
        // Add any other user-related data you need here
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '30s' }
  );

  const newRefreshToken = jwt.sign(
    { email: foundUser.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '1m' }
  );

  // Saving refreshToken with current user
  foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
  const result = await foundUser.save();

  // Creates Secure Cookie with refresh token
  res.cookie('jwt', newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken });
};

module.exports = { handleRefreshToken };
