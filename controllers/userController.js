const User = require('../models/userModel');
const userPromises = require('../controllers_promises/userControllerPromises');

/**
 * Create and save a new user
 * @param {JSON} req The request to the api with the user data to save
 * @param {JSON} res The response from the api
 */
function signUp(req, res) {
  const {nickname} = req.body;
  const {tag} = req.body;
  const {tagname} = req.body;

  const newUser = new User({
    nickname,
    tag,
    tagname,
  });

  userPromises.saveUser(tag, newUser)
      .then((response) => {
        return res.send(response);
      })
      .catch((err) => {
        return res.status(err.value).send(err.message);
      });
}

/**
 * Update the user information
 * @param {JSON} req The request to the api with the user data to update a user
 * @param {JSON} res The response from the api
 */
function updateUser(req, res) {
  const updatedFields = {};

  const {tag} = req.body;
  const {nickname} = req.body;
  const {tagname} = req.body;
  const {joinDate} = req.body;
  const {patrullas} = req.body;
  const {kicks} = req.body;
  const {bans} = req.body;

  if (nickname) updatedFields.nickname = nickname;
  if (tagname) updatedFields.tagname = tagname;
  if (joinDate) updatedFields.joinDate = joinDate;
  if (patrullas) updatedFields.patrullas = patrullas;
  if (kicks) updatedFields.kicks = kicks;
  if (bans) updatedFields.bans = bans;

  userPromises.updateUser(tag, updatedFields)
      .then((response) => {
        return res.send(response);
      })
      .catch((err) => {
        return res.status(err.value).send(err.message);
      });
}

/**
 * Get all users from database
 * @param {JSON} req The request to the api with the user data to get all users
 * @param {JSON} res The response from the api
 */
function getUsers(req, res) {
  userPromises.getUsers()
      .then((response) => {
        return res.send(response);
      })
      .catch((err) => {
        return res.status(err.value).send(err.message);
      });
}

/**
 * Get all users from database
 * @param {JSON} req The request to the api with the user data to get all users
 * @param {JSON} res The response from the api
 */
function getUser(req, res) {
  const {tag} = req.params;

  userPromises.getUserByTag(tag)
      .then((response) => {
        return res.send(response);
      })
      .catch((err) => {
        return res.status(err.value).send(err.message);
      });
}

module.exports = {
  signUp,
  updateUser,
  getUsers,
  getUser,
};
