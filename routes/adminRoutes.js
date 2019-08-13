const express = require('express');
const adminController = require('../controllers/adminController');
const {auth} = require('../services/authService');

const api = new express.Router();

api.get('/', auth, adminController.getAdmins);
api.get('/:tag', auth, adminController.getAdmin);
api.post('/', adminController.signUp);
api.post('/:tag', adminController.login);
api.patch('/:tag', auth, adminController.updateAdmin);

module.exports = api;
