const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
const ObjectId = Schema.ObjectId;
const postSchema = new Schema({
  user_id: ObjectId,
  content: String,
  heart_total: Number,
  edited: Boolean,
  date: Date,
  offset: Number,
  imgs: [],
  comments: [{
    type: ObjectId,
    ref: 'comments'
  }]
}, {
	collection: 'posts',
	versionKey: false
});

var postModel = new mongoose.model('posts', postSchema);
module.exports = postModel;


