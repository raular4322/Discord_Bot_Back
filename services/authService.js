const Token = require('./tokenService');
const Admin = require('../models/adminModel');

/**
 * Checks if the token provided is valid
 * @param {JSON} req The request to the api
 * @param {JSON} res The api response in case the token is not valid
 * @param {JSON} next Let the process continue to the next stage
 * @return {JSON} The api response
 */
function auth(req, res, next) {
  const {token} = req.headers;

  if (!token) {
    return res.status(400).send({message: 'Missing params'});
  };

  Token.decodeToken(token)
      .then((result) => {
        Admin.findOne({tag: result}, (err, admin) => {
          if (err) {
            return res.status(500).send({message: `Server error: ${err}`});
          }
          if (!admin) return res.status(401).send({message: 'unauthorized'});
          next();
        });
      })
      .catch((err) => {
        return res.send(err);
      });
};

module.exports = {
  auth,
};
