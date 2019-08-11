const express = require('express');
const userController = require('../controllers/userController');
const {auth} = require('../services/authService');

const api = new express.Router();

api.post('/signup', auth, userController.signUp);
api.put('/update', auth, userController.updateUser);
api.get('/all', auth, userController.getUsers);
api.get('/:tag', auth, userController.getUser);

module.exports = api;
