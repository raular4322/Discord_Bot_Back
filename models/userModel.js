const mongoose = require('mongoose');

const {Schema} = mongoose;

/**
 * roles: [{name: {type: String}, date}]
 * patrullas: [{date: {type: Date}, days: {type: Number}}]
 * kicks: [{date: {type: Date}]
 * bans: [{date: {type: Date}]
 */
const userSchema = new Schema({
  nickname: {type: String, required: false, unique: false, default: ''},
  tag: {type: String, required: true, unique: true, default: '#0000'},
  tagname: {type: String, required: true, unique: false, default: 'test'},
  imagen: {type: String, required: false, unique: false, default: ''},
  joinDate: {type: Date, required: false, unique: false, default: Date.now()},
  roles: {type: Array, required: false, unique: false, default: []},
  patrullas: {type: Array, required: false, unique: false, default: []},
  kicks: {type: Array, required: false, unique: false, default: []},
  bans: {type: Array, required: false, unique: false, default: []},
  active: {type: Boolean, default: true},
});

module.exports = mongoose.model('User', userSchema);
