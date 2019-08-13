const User = require('../models/userModel');

/**
 * Get all users from database
 * @param {JSON} req The request to the api with the data to get all users
 * @param {JSON} res The response from the api
 */
function getUsers(req, res) {
  User.find({}, (err, users) => {
    if (err) res.status(500).send({message: `Internal server error ${err}`});
    if (!users) return res.status(404).send({message: 'No users found'});

    return res.status(200).send(users);
  });
}

/**
 * Get all users from database
 * @param {JSON} req The request to the api with the data to get all users
 * @param {JSON} res The response from the api
 * @return {JSON} The response and the return are the same
 */
function getUser(req, res) {
  const {tag} = req.params;

  if (!tag) return res.status(400).send({message: 'Missing params'});

  User.findOne({tag}, (err, user) => {
    if (err) res.status(500).send({message: `Internal server error ${err}`});
    if (!user) return res.status(404).send({message: 'No users found'});

    return res.status(200).send(user);
  });
}

/**
 * Create and save a new user
 * @param {JSON} req The request to the api with the user data to save
 * @param {JSON} res The response from the api
 * @return {JSON} The response and the return are the same
 */
function signUp(req, res) {
  const {nickname} = req.body;
  const {tag} = req.body;
  const {tagname} = req.body;

  if (!tagname || !tag || !nickname) {
    return res.status(400).send({message: 'Missing params'});
  }

  User.findOne({tag}, (err1, userExist) => {
    if (err1) {
      return res.status(500).send({message: `Internal server error: ${err1}`});
    }
    if (userExist) return res.status(409).send({message: 'User already exist'});

    // Create a new user
    const newUser = new User({
      nickname,
      tag,
      tagname,
    });

    // Save the new user
    newUser.save((err2, newUser) => {
      if (err2) {
        return res.status(500).send({message: `Error saving user ${err2}`});
      }
      if (!newUser) return res.status(500).send({message: 'No user to save'});

      return res.status(200).send({message: 'User saved', newUser});
    });
  });
}

/**
 * Update the user information
 * @param {JSON} req The request to the api with the user data to update a user
 * @param {JSON} res The response from the api
 */
function updateUser(req, res) {
  const updatedFields = {};

  const {tag} = req.params;
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

  User.findOneAndUpdate({tag}, updatedFields, (err, doc) => {
    if (err) {
      return res.status(500).send({message: `Internal server error ${err}`});
    }
    if (!doc) return res.status(404).send({message: 'User not found'});

    return res.status(200).send({message: 'User updated'});
  });
}


module.exports = {
  signUp,
  updateUser,
  getUsers,
  getUser,
};
