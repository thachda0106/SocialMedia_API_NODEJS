const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
const ObjectId = Schema.ObjectId;
const storyCollectionSchema = new Schema({
  user_id: ObjectId,
  name: String,
  avatar: String,
  Storys: [],

}, {
	collection: 'story_collections',
	versionKey: false
});

var storyCollectionModel = new mongoose.model('story_collections', storyCollectionSchema);
module.exports = storyCollectionModel;



  