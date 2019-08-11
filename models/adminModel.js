const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const {Schema} = mongoose;

/**
 * patrullas: [{date: {type: Date}, days: {type: Number}}]
 * kicks: [{date: {type: Date}]
 * bans: [{date: {type: Date}]
 */
const adminSchema = new Schema({
  nickname: {type: String, required: false, unique: false, default: ''},
  tag: {type: String, required: true, unique: true, default: '#0000'},
  tagname: {type: String, required: true, unique: false, default: 'test'},
  imagen: {type: String, required: false, unique: false, default: ''},
  joinDate: {type: Date, required: true, unique: false, default: Date.now()},
  roles: {type: Array, required: false, unique: false, default: []},
  patrullas: {type: Array, required: false, unique: false, default: []},
  kicks: {type: Array, required: false, unique: false, default: []},
  bans: {type: Array, required: false, unique: false, default: []},
  password: {type: String, required: true, unique: false, default: '12345678'},
  active: {type: Boolean},
});

adminSchema.pre('save', function(next) {
  const admin = this;
  if (!admin.isModified('password')) return next();
  bcrypt.genSalt((err, salt) => {
    if (err) return next(err);
    bcrypt.hash(admin.password, salt, (err, hash) => {
      if (err) return next(err);
      admin.password = hash;
      admin.active = true;
      next();
    });
  });
});

adminSchema.methods.comparePassword = function(candidatePassword, result) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    result(err, isMatch);
  });
};

module.exports = mongoose.model('Admin', adminSchema);
