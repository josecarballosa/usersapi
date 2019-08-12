const jwt = require('jsonwebtoken');
// const express_jwt = require('express-jwt');
const { secret, expiresIn } = require('../../config');
const asyncHandler = require('./async-handler');

const auth = 'auth';

// TODO: throw "express-jwt" errors instead

function express_jwt({ credentialsRequired, secret, requestProperty = auth }) {
  return async function (req, res, next) {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      if (credentialsRequired) {
        return res.status(401).json({ errors: {"authorization header": "is missing"} });
      } else {
        return next();
      }
    }
    const [ lead, token ] = authorizationHeader.split(' ');
    if (lead !== 'Token' && lead !== 'Bearer') {
      return res.status(401).json({ errors: {"authorization header": "is invalid"} });
    }
    try {
      req[requestProperty] = jwt.verify(token, secret);
      next();
    }
    catch (error) {
      return res.status(401).json({ errors: {"authorization": error.message }});
    }
  }
}

module.exports = {
  optional: asyncHandler( express_jwt({ credentialsRequired: false, secret, requestProperty: auth }) ),

  required: asyncHandler( express_jwt({ credentialsRequired: true, secret, requestProperty: auth }) ),

  getToken: (username) => 
    jwt.sign({ username }, secret, { expiresIn }),
};
