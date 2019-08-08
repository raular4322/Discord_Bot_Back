const Admin = require('../models/adminModel');
const adminPromises = require('../controllers_promises/adminControllerPromises');

/**
 * Login
 * @param {JSON} req The request to the api with the user data to login
 * @param {JSON} res The response from the api
 */
function login(req, res) {
  const {tag} = req.body;
  const {password} = req.body;

  Admin.findOne({tag}, (err, admin) => {
    if (err) return res.status(500).send({message: `Error: ${err}`});
    if (!admin) return res.status(404).send({message: 'No user found'});

    admin.comparePassword(password, (err, isMatch) => {
      if (err) return res.status(500).send({message: `Error: ${err}`});
      if (!isMatch) return res.status(401).send({message: 'Unothorized'});

      return res.status(200).send([admin]);
    });
  });
}

/**
 * Create and save a new Admin
 * @param {JSON} req The request to the api with the Admin data to save
 * @param {JSON} res The response from the api
 */
function signUp(req, res) {
  const {nickname} = req.body;
  const {tag} = req.body;
  const {tagname} = req.body;
  const {password} = req.body;

  // Checks if the user already exist
  Admin.findOne({tag}, (err, admin) => {
    if (err) return res.status(500).send({message: `Error: ${err}`});
    if (admin) return res.status(409).send({message: 'Admin already exist'});

    const newAdmin = new Admin({
      nickname,
      tag,
      tagname,
      password,
    });

    // Save the new user
    newAdmin.save((error, newAdmin) => {
      if (error) return res.status(500).send({message: `Error: ${error}`});
      if (!newAdmin) return res.status(500).send({message: 'No Admin saved'});

      return res.status(200).send({message: 'Saved'});
    });
  });
}

/**
 * Update the user information
 * @param {JSON} req The request to the api with the user data to update a user
 * @param {JSON} res The response from the api
 */
function updateUser(req, res) {
  const {tag} = req.body;
  const {nickname} = req.body;
  const {tagname} = req.body;
  const {joinDate} = req.body;
  const {patrullas} = req.body;
  const {kicks} = req.body;
  const {bans} = req.body;
  const {password} = req.body;

  // Get the new information
  if (nickname) updatedFields.nickname = nickname;
  if (tagname) updatedFields.tagname = tagname;
  if (joinDate) updatedFields.joinDate = joinDate;
  if (patrullas) updatedFields.patrullas = patrullas;
  if (kicks) updatedFields.kicks = kicks;
  if (bans) updatedFields.bans = bans;
  if (password) updatedFields.password = password;

  // Update the user
  Admin.findOneAndUpdate({tag}, updatedFields, (err, updatedAdmin) => {
    if (err) return res.status(500).send({message: `Error: ${err}`});
    if (!user) return res.status(404).send({message: 'Admin not found'});

    return res.status(200).send({message: updatedAdmin});
  });
}

/**
 * Get all users from database
 * @param {JSON} req The request to the api with the user data to get all users
 * @param {JSON} res The response from the api
 */
function getAdmins(req, res) {
  Admin.find({}, (err, admins) => {
    if (err) return res.status(500).send({message: `Error: ${err}`});
    if (!admins) return res.status(404).send({message: 'No admins found'});

    return res.status(200).send(admins);
  });
}

/**
 * Get all users from database
 * @param {JSON} req The request to the api with the user data to get all users
 * @param {JSON} res The response from the api
 */
function getAdmin(req, res) {
  const {tag} = req.params;

  Admin.findOne({tag}, (err, admin) => {
    if (err) return res.status(500).send({message: `Error: ${err}`});
    if (!admin) return res.status(404).send({message: 'No user found'});

    return res.status(200).send([admin]);
  });
}

module.exports = {
  signUp,
  login,
  updateUser,
  getAdmins,
  getAdmin,
};
