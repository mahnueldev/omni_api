const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');


if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.development.local' });
} else {
  dotenv.config({ path: '.env.production.local' });
}

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Unauthorized' });
}
const token = authHeader.split(' ')[1];


  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) return res.status(403).json({ msg: 'Invalid token' });
      req.user = decoded.userInfo.email; // Store just the user ID
      // req.roles = decoded.roles; // Store the roles
      next();
    }
  );
};

module.exports = verifyJWT;
