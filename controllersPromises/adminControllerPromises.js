const Admin = require('../models/adminModel');
const {
  badRequest,
  unauthorized,
  notFound,
  internalServerError,
} = require('./controllerPromisesErrors');

/**
 * Logs the admin in
 * @param {String} tag The tag of the admin
 * @param {String} password The password of the admin
 * @return {Admin} The result of comparing the passwords
 */
function loginAdmin(tag, password) {
  return new Promise((resolve, reject) => {
    if (!tag || !password) {
      reject(badRequest('loginAdmin', 'missing params'));
      return;
    }

    Admin.findOne({tag}, (err, admin) => {
      if (err) {
        reject(internalServerError('loginAdmin'));
        return;
      }
      if (!admin) {
        reject(badRequest('loginAdmin'));
        return;
      }

      admin.comparePassword(password, (err, result) => {
        if (err) {
          reject(internalServerError('loginAdmin'));
          return;
        }
        if (!result) {
          reject(unauthorized('loginAdmin'));
          return;
        }
        resolve(admin);
      });
    });
  });
}

/**
 * Save admin in the database
 * @param {String} tag The tag of the admin
 * @param {Admin} adminToSave The admin to save
 * @return {Admin} The admins saved
 */
function saveAdmin(tag, adminToSave) {
  return new Promise((resolve, reject) => {
    if (!tag || !adminToSave || !adminToSave.tagname) {
      reject(badRequest('saveAdmin', 'missing params'));
      return;
    }

    Admin.findOne({tag}, (err, admin) => {
      if (err) {
        reject(internalServerError('saveAdmin', err));
        return;
      }
      if (admin) {
        reject(badRequest('saveAdmin', 'admin already exist'));
        return;
      }

      adminToSave.save((err, newAdmin) => {
        if (err) {
          reject(internalServerError('saveAdmin', err));
          return;
        }
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
  return new Promise((resolve, reject) => {
    if (!tag || updateFields.length === 0) {
      reject(badRequest('updateAdmin', 'missing params'));
      return;
    }

    Admin.findOne({tag}, (err, admin) => {
      if (err) {
        reject(internalServerError('updateAdmin', err));
        return;
      }
      if (!admin) {
        reject(notFound('updateAdmin', 'no admin found'));
        return;
      }

      admin.set(updateFields);
      admin.save((err) => {
        if (err) {
          reject(internalServerError('updateAdmin', err));
          return;
        }
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
  return new Promise((resolve, reject) => {
    Admin.find({}, (err, admins) => {
      if (err) {
        reject(internalServerError('getAdmins', err));
        return;
      }
      if (!admins.length === 0) {
        reject(notFound('getAdmins', 'no admins found'));
        return;
      }
      resolve(admins);
    });
  });
}

/**
 * Get all active admins from the database admin
 * @return {JSON} A JSON with all the objects admin found
 */
function getActiveAdmins() {
  return new Promise((resolve, reject) => {
    Admin.find({active: true}, (err, admins) => {
      if (err) {
        reject(internalServerError('getActiveAdmins', err));
        return;
      }
      if (!!admins.length === 0) {
        reject(notFound('getActiveAdmins', 'no admins found'));
        return;
      }
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
  return new Promise((resolve, reject) => {
    if (!tag) {
      reject(badRequest('getAdminByTag', 'missing params'));
      return;
    }

    Admin.findOne({tag}, (err, admin) => {
      if (err) {
        reject(internalServerError('getAdminByTag', err));
        return;
      }
      if (!admin) {
        reject(notFound('getAdminByTag', 'no admin found'));
        return;
      }
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
