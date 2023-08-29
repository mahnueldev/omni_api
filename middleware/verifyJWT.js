const jwt = require('jsonwebtoken');
const config = require('config');

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
  const accessToken= authHeader.split(' ')[1];

  jwt.verify(
    accessToken,
    config.get('accessTokenSecret'),
    (err, decoded) => {
      if (err) return res.sendStatus(403); // invalid token
      req.user = decoded.user; // Store just the user ID
      req.roles = decoded.roles; // Store the roles
      next();
    }
  );
};

module.exports = verifyJWT;
