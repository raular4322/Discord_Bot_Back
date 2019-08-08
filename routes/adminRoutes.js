const express = require('express');
const adminController = require('../controllers/adminController');

const api = new express.Router();

api.post('/signup', adminController.signUp);
api.post('/login', adminController.login);
api.put('/update', adminController.updateAdmin);
api.get('/all', adminController.getAdmins);
api.get('/:tag', adminController.getAdmin);

module.exports = api;
