const User = require('../models/userModel');
const {
  badRequest,
  notFound,
  internalServerError,
} = require('./controllerPromisesErrors');

/**
 * Save user in the database
 * @param {String} tag The tag of the user
 * @param {User} user The user to save
 * @return {User} The users saved
 */
function saveUser(tag, user) {
  return new Promise((resolve, reject) => {
    if (!tag || !user || !user.tagname) {
      reject(badRequest('saveUser', 'missing params'));
      return;
    }

    User.findOne({tag}, (err, user) => {
      if (err) {
        reject(internalServerError('saveUser', err));
        return;
      }
      if (user) {
        reject(badRequest('saveUser', 'user already exist'));
        return;
      }

      user.save((err, newUser) => {
        if (err) {
          reject(internalServerError('saveUser', err));
          return;
        }
        resolve(newUser);
      });
    });
  });
}

/**
 * find one user with the specify tag and updates it
 * @param {String} tag The tag from a user
 * @param {Array} updateFields The new fields
 * @return {User} The updated user
 */
function updateUser(tag, updateFields) {
  return new Promise((resolve, reject) => {
    if (!tag || updateFields.length === 0) {
      reject(badRequest('updateUser', 'missing params'));
      return;
    }

    User.findOne({tag}, (err, user) => {
      if (err) {
        reject(internalServerError('updateUser', err));
        return;
      }
      if (!user) {
        reject(notFound('updateUser', 'no user found'));
        return;
      }

      user.set(updateFields);
      user.save((err) => {
        if (err) {
          reject(internalServerError('updateUser', err));
          return;
        }
        resolve(user);
      });
    });
  });
}

/**
 * get all users from the database User
 * @return {JSON} A JSON with all the objects User found
 */
function getUsers() {
  return new Promise((resolve, reject) => {
    User.find({}, (err, users) => {
      if (err) {
        reject(internalServerError('getUsers', err));
        return;
      }
      if (users.length === 0) {
        reject(notFound('getUsers', 'no users found'));
        return;
      }
      resolve(users);
    });
  });
}

/**
 * get all active users from the database User
 * @return {JSON} A JSON with all the objects User found
 */
function getActiveUsers() {
  return new Promise((resolve, reject) => {
    User.find({active: true}, (err, users) => {
      if (err) {
        reject(internalServerError('getActiveUsers', err));
        return;
      }
      if (users.length === 0) {
        reject(notFound('getActiveUsers', 'no users found'));
        return;
      }
      resolve(users);
    });
  });
}

/**
 * get one user with the specify tag
 * @param {String} tag The tag from a user
 * @return {User} A object User
 */
function getUserByTag(tag) {
  return new Promise((resolve, reject) => {
    if (!tag) {
      reject(badRequest('getUserByTag'));
      return;
    }

    User.findOne({tag}, (err, user) => {
      if (err) {
        reject(internalServerError('getUserByTag', err));
        return;
      }
      if (!user) {
        reject(notFound('getUserByTag'));
        return;
      }
      resolve(user);
    });
  });
}

module.exports = {
  saveUser,
  updateUser,
  getUsers,
  getActiveUsers,
  getUserByTag,
};
