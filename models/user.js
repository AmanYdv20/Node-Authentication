var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
  Usename: String,
  password: String,
});

//explicitly call serialize and deserialsize
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);
