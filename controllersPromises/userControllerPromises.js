const User = require('../models/userModel');
const {badRequestError} = require('./controllerPromisesErrors');
const {notFoundError} = require('./controllerPromisesErrors');
const {internalServerError} = require('./controllerPromisesErrors');

/**
 * get all users from the database User
 * @return {JSON} A JSON with all the objects User found
 */
function getUsers() {
  return new Promise((reject, resolve) => {
    User.find({}, (err, users) => {
      if (err) reject(internalServerError('getUsers', err));
      if (users.length === 0) reject(notFoundError('getUsers'));
      resolve(users);
    });
  });
}

/**
 * get all active users from the database User
 * @return {JSON} A JSON with all the objects User found
 */
function getActiveUsers() {
  return new Promise((reject, resolve) => {
    User.find({active: true}, (err, users) => {
      if (err) reject(internalServerError('getActiveUsers', err));
      if (users.length === 0) reject(notFoundError('getActiveUsers'));
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
  return new Promise((reject, resolve) => {
    if (!tag) reject(badRequestError('getUserByTag'));

    User.findOne({tag}, (err, user) => {
      if (err) reject(internalServerError('getUserByTag', err));
      if (!user) reject(notFoundError('getUserByTag'));
      resolve(user);
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
  return new Promise((reject, resolve) => {
    if (!tag || updateFields.length === 0) {
      reject(badRequestError('updateUser'));
    }

    User.findOne({tag}, (err, user) => {
      if (err) reject(internalServerError('updateUser', err));
      if (!user) reject(notFoundError('updateUser'));

      user.set(updateFields);
      user.save((err) => {
        if (err) reject(internalServerError('updateUser', err));
        resolve(user);
      });
    });
  });
}

/**
 * Save user in the database
 * @param {String} tag The tag of the user
 * @param {User} user The user to save
 * @return {User} The users saved
 */
function saveUser(tag, user) {
  return new Promise((reject, resolve) => {
    if (!tag || !user || !user.tagname) reject(badRequestError('saveUser'));

    User.findOne({tag}, (err, user) => {
      if (err) reject(internalServerError('saveUser', err));
      if (!user) reject(badRequestError('saveUser'));

      user.save((err, newUser) => {
        if (err) reject(internalServerError('saveUser', err));
        resolve(newUser);
      });
    });
  });
}

module.exports = {
  getUsers,
  getActiveUsers,
  getUserByTag,
  updateUser,
  saveUser,
};
