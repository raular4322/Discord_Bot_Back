const Admin = require('../models/adminModel');
const adminPromises = require('../controllersPromises/adminControllerPromises');
const Token = require('../services/tokenService');

/**
 * Login
 * @param {JSON} req The request to the api with the data to login
 * @param {JSON} res The api response
 */
function login(req, res) {
  const {tag} = req.body;
  const {password} = req.body;

  adminPromises.loginAdmin(tag, password)
      .then((admin) => {
        const response = {
          admin,
          token: Token.generateToken(admin),
        };
        return res.send(response);
      })
      .catch((err) => {
        return res.status(err.value).send(err.message);
      });
}

/**
 * Create and save a new Admin
 * @param {JSON} req The request to the api with the Admin data to save
 * @param {JSON} res The api response
 */
function signUp(req, res) {
  const {nickname} = req.body;
  const {tag} = req.body;
  const {tagname} = req.body;
  const {password} = req.body;

  const newAdmin = new Admin({
    nickname,
    tag,
    tagname,
    password,
  });

  adminPromises.saveAdmin(tag, newAdmin)
      .then((response) => {
        return res.send(response);
      })
      .catch((err) => {
        return res.status(err.value).send(err.message);
      });
}

/**
 * Update the admin information
 * @param {JSON} req The request to the api with the data to update an admin
 * @param {JSON} res The api response
 */
function updateAdmin(req, res) {
  const {tag} = req.body;
  const {nickname} = req.body;
  const {tagname} = req.body;
  const {joinDate} = req.body;
  const {patrullas} = req.body;
  const {kicks} = req.body;
  const {bans} = req.body;
  const {password} = req.body;

  if (nickname) updatedFields.nickname = nickname;
  if (tagname) updatedFields.tagname = tagname;
  if (joinDate) updatedFields.joinDate = joinDate;
  if (patrullas) updatedFields.patrullas = patrullas;
  if (kicks) updatedFields.kicks = kicks;
  if (bans) updatedFields.bans = bans;
  if (password) updatedFields.password = password;

  adminPromises.updateAdmin(tag, updatedFields)
      .then((response) => {
        return res.send(response);
      })
      .catch((err) => {
        return res.status(err.value).send(err.message);
      });
}

/**
 * Get all admins from database
 * @param {JSON} req The request to the api with the data to get all admins
 * @param {JSON} res The api response
 */
function getAdmins(req, res) {
  adminPromises.getAdmins()
      .then((response) => {
        return res.send(response);
      })
      .catch((err) => {
        return res.status(err.value).send(err.message);
      });
}

/**
 * Get all admins from database
 * @param {JSON} req The request to the api with the data to get all admins
 * @param {JSON} res The api response
 */
function getAdmin(req, res) {
  const {tag} = req.params;

  adminPromises.getAdminByTag(tag)
      .then((response) => {
        return res.send(response);
      })
      .catch((err) => {
        return res.status(err.value).send(err.message);
      });
}

module.exports = {
  signUp,
  login,
  updateAdmin,
  getAdmins,
  getAdmin,
};
