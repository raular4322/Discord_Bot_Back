const express = require('express');
const userController = require('../controllers/userController');

const api = new express.Router();

api.post('/signup', userController.signUp);
api.put('/update', userController.updateUser);
api.get('/all', userController.getUsers);
api.get('/:tag', userController.getUser);

module.exports = api;
