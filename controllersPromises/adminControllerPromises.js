const Admin = require('../models/adminModel');
const {badRequestError} = require('./controllerPromisesErrors');
const {unauthorized} = require('./controllerPromisesErrors');
const {notFoundError} = require('./controllerPromisesErrors');
const {internalServerError} = require('./controllerPromisesErrors');

/**
 * Logs the admin in
 * @param {String} tag The tag of the admin
 * @param {String} password The password of the admin
 * @return {Boolean} The result of comparing the passwords
 */
function loginAdmin(tag, password) {
  return new Promise((reject, resolve) => {
    if (!tag || !password) reject(badRequestError('loginAdmin'));

    Admin.findOne({tag}, (err, admin) => {
      if (err) reject(internalServerError('loginAdmin'));
      if (admin) reject(badRequestError('loginAdmin'));

      admin.comparePassword(password, (err, result) => {
        if (err) reject(internalServerError('loginAdmin'));
        if (!result) reject(unauthorized('loginAdmin'));
        resolve(result);
      });
    });
  });
}

/**
 * Save admin in the database
 * @param {String} tag The tag of the admin
 * @param {Admin} admin The admin to save
 * @return {Admin} The admins saved
 */
function saveAdmin(tag, admin) {
  return new Promise((reject, resolve) => {
    if (!tag || !admin || !admin.tagname) reject(badRequestError('saveAdmin'));

    Admin.findOne({tag}, (err, admin) => {
      if (err) reject(internalServerError('saveAdmin', err));
      if (admin) reject(badRequestError('saveAdmin'));

      admin.save((err, newAdmin) => {
        if (err) reject(internalServerError('saveAdmin', err));
        resolve(newAdmin);
      });
    });
  });
}

/**
 * Find one admin with the specify tag and updates it
 * @param {String} tag The tag from a admin
 * @param {Array} updateFields The new fields
 * @return {Admin} The updated admin
 */
function updateAdmin(tag, updateFields) {
  return new Promise((reject, resolve) => {
    if (!tag || updateFields.length === 0) {
      reject(badRequestError('updateAdmin'));
    }

    Admin.findOne({tag}, (err, admin) => {
      if (err) reject(internalServerError('updateAdmin', err));
      if (!admin) reject(notFoundError('updateAdmin'));

      admin.set(updateFields);
      admin.save((err) => {
        if (err) reject(internalServerError('updateAdmin', err));
        resolve(admin);
      });
    });
  });
}

/**
 * Get all admins from the database admin
 * @return {JSON} A JSON with all the objects admin found
 */
function getAdmins() {
  return new Promise((reject, resolve) => {
    Admin.find({}, (err, admins) => {
      if (err) reject(internalServerError('getAdmins', err));
      if (!admins) reject(notFoundError('getAdmins'));
      resolve(admins);
    });
  });
}

/**
 * Get all active admins from the database admin
 * @return {JSON} A JSON with all the objects admin found
 */
function getActiveAdmins() {
  return new Promise((reject, resolve) => {
    Admin.find({active: true}, (err, admins) => {
      if (err) reject(internalServerError('getActiveAdmins', err));
      if (!admins) reject(notFoundError('getActiveAdmins'));
      resolve(admins);
    });
  });
}

/**
 * Get one admin with the specify tag
 * @param {String} tag The tag from a admin
 * @return {Admin} A object admin
 */
function getAdminByTag(tag) {
  return new Promise((reject, resolve) => {
    if (!tag) reject(badRequestError('getAdminByTag'));

    Admin.findOne({tag}, (err, admin) => {
      if (err) reject(internalServerError('getAdminByTag', err));
      if (!admin) reject(notFoundError('getAdminByTag'));
      resolve(admin);
    });
  });
}

module.exports = {
  loginAdmin,
  saveAdmin,
  updateAdmin,
  getAdmins,
  getActiveAdmins,
  getAdminByTag,
};
