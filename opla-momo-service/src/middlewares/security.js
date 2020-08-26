const {verifyToken} = require('../utils/security');
const User = require('../models/user');

module.exports = (req, res, next) => {
  if (req.headers['eg-consumer-id']) {
    const token = req.headers.authorization.substr(7);
    verifyToken(token)
      .then((payload) => {
        req.headers.user = new User(payload);
      })
      .finally(() => next());
  } else {
    next();
  }
};
