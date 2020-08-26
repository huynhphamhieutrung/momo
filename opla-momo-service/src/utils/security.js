const fs = require('fs');
const jwt = require('jsonwebtoken');
const publicKey = fs.readFileSync('public.pem');

module.exports = {
  requireRole: (...roles) => (req, res, next) => {
    if (!roles.length) {
      next();
    } else if (!req.headers.user || !roles.includes(req.headers.user.role)) {
      res.sendStatus(403);
    } else {
      next();
    }
  },
  verifyToken: (token) => new Promise((resolve, reject) => {
    jwt.verify(token, publicKey, (error, payload) => {
      error ? reject(error) : resolve(payload);
    });
  }),
};
