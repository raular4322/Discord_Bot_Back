const crypto = require('crypto');
const config = require('../config');
const jwt = require('jwt-simple');
const moment = require('moment');
const {
  badRequestError,
  unauthorized,
} = require('../controllersPromises/controllerPromisesErrors');

/**
 * Encrypts the text
 * @param {String} text The string to encrypt
 * @return {String} A encrypted string
 */
function encrypt(text) {
  const iv = Buffer.from(config.IV, 'hex');
  const cipher = crypto.createCipheriv(config.ALGORITHM, config.KEY, iv);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

/**
 * Decrypts a encrypted text
 * @param {String} text The text to decrypt
 * @return {String} A decrypted string
 */
function decrypt(text) {
  const iv = Buffer.from(config.IV, 'hex');
  const decipher = crypto.createDecipheriv(config.ALGORITHM, config.KEY, iv);
  let decrypted = decipher.update(text, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

/**
 * Generates a token for an admin
 * @param {Admin} admin The admin to generate the token
 * @return {String} A token
 */
function generateToken(admin) {
  const payload = {
    sub: encrypt(admin.tag),
    iat: moment().unix(),
    exp: moment().add(config.EXP_DAYS, 'days').unix(),
  };
  return jwt.encode(payload, config.SECRET_TOKEN);
}

/**
 * Decode the token to extract the information of the Admin
 * @param {String} token The token to decode
 * @return {String} The Admin's tag from the token
 */
function decodeToken(token) {
  return new Promise((resolve, reject) => {
    try {
      const payload = jwt.decode(token, config.SECRET_TOKEN);
      if (payload.exp <= moment().unix()) reject(unauthorized('decodeToken'));
      const userTag = decrypt(payload.sub);
      resolve(userTag);
    } catch (err) {
      reject(badRequestError('decodeToken'));
    }
  });
};

module.exports = {
  encrypt,
  decrypt,
  generateToken,
  decodeToken,
};
