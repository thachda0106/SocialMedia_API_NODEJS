const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
const ObjectId = Schema.ObjectId;
const profileSchema = new Schema({
  first_name: String,
  last_name: String,
  phone: String,
  email: String,
  date_of_birth: String,
  sex: String,
  avatar: String,
}, {
	collection: 'profiles',
	versionKey: false
});

var profileModel = new mongoose.model('profiles', profileSchema);

module.exports = profileModel;


