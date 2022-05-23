const { sign } = require('jsonwebtoken');

exports.generateAuthToken = (id, pseudo, email) => {
  return sign(
    { id, pseudo, email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );
};
