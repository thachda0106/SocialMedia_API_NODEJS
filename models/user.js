const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/DB_SocialMedia');
const profileModel = require('./profile.js') 
const postModel = require('./post')
const storyCollectionModel = require('./storyCollection.js')
const storyModel = require('./story.js')
const commentModel = require('./comment.js')

const Schema = mongoose.Schema; 
const ObjectId = Schema.ObjectId;
const userSchema = new Schema({
  username: String,
  password: String,
  status_now: String,
  type: String,
  profile_id: {
	  type:ObjectId,
	  ref: 'profiles'
  },
  following:{
	total: {
		type: Number,
		default: 0
	},
	list: [{
		type: ObjectId,
		default: [],
		ref: "users"
	}]
  },
  followers:{
	total: {
		type: Number,
		default: 0
	},
	list: [{
		user_id: {
			type: ObjectId,
			ref: "users"
		},
		followed: Boolean,
	}]
  	}
}, {
	collection: 'users',
	versionKey: false
});

var userModel = new mongoose.model('users', userSchema);

module.exports = {
	userModel,
	profileModel,
	postModel,
	storyCollectionModel,
	storyModel,
	commentModel,
}


