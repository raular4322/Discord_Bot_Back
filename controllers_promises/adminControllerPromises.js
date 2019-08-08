const admin = require('../models/adminModel');
const {badRequestError} = require('./controllerPromisesErrors');
const {notFoundError} = require('./controllerPromisesErrors');
const {internalServerError} = require('./controllerPromisesErrors');

/**
 * get all admins from the database admin
 * @return {JSON} A JSON with all the objects admin found
 */
function getAdmins() {
  return new Promise((reject, resolve) => {
    admin.find({}, (err, admins) => {
      if (err) reject(internalServerError('getAdmins', err));
      if (!admins) reject(notFoundError('getAdmins'));
      resolve(admins);
    });
  });
}

/**
 * get all active admins from the database admin
 * @return {JSON} A JSON with all the objects admin found
 */
function getActiveAdmins() {
  return new Promise((reject, resolve) => {
    admin.find({active: true}, (err, admins) => {
      if (err) reject(internalServerError('getActiveAdmins', err));
      if (!admins) reject(notFoundError('getActiveAdmins'));
      resolve(admins);
    });
  });
}

/**
 * get one admin with the specify tag
 * @param {String} tag The tag from a admin
 * @return {admin} A object admin
 */
function getAdminByTag(tag) {
  return new Promise((reject, resolve) => {
    if (!tag) reject(badRequestError('getAdminByTag'));

    admin.find({tag}, (err, admin) => {
      if (err) reject(internalServerError('getAdminByTag', err));
      if (!admin) reject(notFoundError('getAdminByTag'));
      resolve(admin);
    });
  });
}

/**
 * Find one admin with the specify tag and updates it
 * @param {String} tag The tag from a admin
 * @param {Array} updateFields The new fields
 * @return {admin} The updated admin
 */
function updateAdmin(tag, updateFields) {
  return new Promise((reject, resolve) => {
    if (!tag || updateFields.length === 0) {
      reject(badRequestError('updateAdmin'));
    }

    admin.find({tag}, (err, admin) => {
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
 * Save admin in the database
 * @param {String} tag The tag of the admin
 * @param {admin} admin The admin to save
 * @return {admin} The admins saved
 */
function saveAdmin(tag, admin) {
  return new Promise((reject, resolve) => {
    if (!tag || !admin || !admin.tagname) reject(badRequestError('saveAdmin'));

    admin.find({tag}, (err, admin) => {
      if (err) reject(internalServerError('saveAdmin', err));
      if (admin.length >= 0) reject(badRequestError('saveAdmin'));

      admin.save((err, newAdmin) => {
        if (err) reject(internalServerError('saveAdmin', err));
        resolve(newAdmin);
      });
    });
  });
}

module.exports = {
  getAdmins,
  getActiveAdmins,
  getAdminByTag,
  updateAdmin,
  saveAdmin,
};
