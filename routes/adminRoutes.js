const express = require('express');
const adminController = require('../controllers/adminController');
const {auth} = require('../services/authService');

const api = new express.Router();

api.post('/signup', adminController.signUp);
api.post('/login', adminController.login);
api.put('/update', auth, adminController.updateAdmin);
api.get('/all', auth, adminController.getAdmins);
api.get('/:tag', auth, adminController.getAdmin);

module.exports = api;
