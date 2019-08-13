const Admin = require('../models/adminModel');
const adminPromises = require('../controllersPromises/adminControllerPromises');
const Token = require('../services/tokenService');
const config = require('../config');

/**
 * Get all admins from database
 * @param {JSON} req The request to the api with the data to get all admins
 * @param {JSON} res The api response
 */
function getAdmins(req, res) {
  Admin.find({}, (err, admins) => {
    if (err) {
      return res.status(500).send({message: `Internal server error ${err}`});
    }
    if (!admins) return res.status(404).send({message: 'No admins found'});

    return res.status(200).send(admins);
  });
}

/**
 * Get all admins from database
 * @param {JSON} req The request to the api with the data to get all admins
 * @param {JSON} res The api response
 * @return {JSON} The response and the return are the same
 */
function getAdmin(req, res) {
  const {tag} = req.params;

  if (!tag) return res.status(400).send({message: 'Missing params'});

  Admin.findOne({tag}, (err, admin) => {
    if (err) {
      return res.status(500).send({message: `Internal server error ${err}`});
    }
    if (!admin) return res.status(404).send({message: 'No admin found'});

    return res.status(200).send(admin);
  });
}

/**
 * Login
 * @param {JSON} req The request to the api with the data to login
 * @param {JSON} res The api response
 * @return {JSON} The response and the return are the same
 */
function login(req, res) {
  const {tag} = req.params;
  const {password} = req.body;

  if (!tag || !password) {
    return res.status(400).send({message: 'Missing params'});
  }

  Admin.findOne({tag}, (err1, admin) => {
    if (err1) {
      return res.status(500).send({message: `Error finding admin ${err1}`});
    }
    if (!admin) {
      return res.status(404).send({message: 'Admin not found'});
    }

    admin.comparePassword(password, (err2, result) => {
      if (err2) {
        return res.status(500).send({message: `Internal server error ${err2}`});
      }
      if (!result) return res.status(401).send({message: 'unauthorized'});
      const response = {
        admin,
        token: Token.generateToken(admin),
      };
      return res.status(200).send(response);
    });
  });
}

/**
 * Create and save a new Admin
 * @param {JSON} req The request to the api with the Admin data to save
 * @param {JSON} res The api response
 * @return {JSON} The response and the return are the same
 */
function signUp(req, res) {
  const {nickname} = req.body;
  const {tag} = req.body;
  const {tagname} = req.body;
  const {password} = req.body;
  const {masterKey} = req.body;

  if (!tagname || !tag || !nickname || !masterKey) {
    return res.status(400).send({message: 'Missing params'});
  }

  if (masterKey != config.MASTERKEY) {
    return res.status(401).send({message: 'unauthorized'});
  }

  Admin.findOne({tag}, (err1, adminExist) => {
    if (err1) {
      return res.status(500).send({message: `Error finding admin ${err1}`});
    }
    if (adminExist) {
      return res.status(409).send({message: 'Admin already exist'});
    }

    const newAdmin = new Admin({
      nickname,
      tag,
      tagname,
      password,
    });

    newAdmin.save((err2, admin) => {
      if (err2) {
        return res.status(500).send({message: `Error saving user ${err2}`});
      }
      if (!admin) return res.status(500).send({message: 'No user to save'});

      return res.status(200).send({message: 'User saved', admin});
    });
  });
}

/**
 * Update the admin information
 * @param {JSON} req The request to the api with the data to update an admin
 * @param {JSON} res The api response
 */
function updateAdmin(req, res) {
  const updatedFields = {};

  const {tag} = req.params;
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

  Admin.findOneAndUpdate({tag}, updatedFields, (err, doc) => {
    if (err) {
      return res.status(500).send({message: `Internal server error ${err}`});
    }
    if (!doc) return res.status(404).send({message: 'Admin not found'});

    return res.status(200).send({message: 'Admin updated'});
  });
}


module.exports = {
  signUp,
  login,
  updateAdmin,
  getAdmins,
  getAdmin,
};
