const express = require('express');
const userController = require('../controllers/userController');
const {auth} = require('../services/authService');

const api = new express.Router();

api.get('/', auth, userController.getUsers);
api.get('/:tag', auth, userController.getUser);
api.post('/', auth, userController.signUp);
api.patch('/:tag', auth, userController.updateUser);

module.exports = api;
