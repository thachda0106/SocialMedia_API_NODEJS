const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
const ObjectId = Schema.ObjectId;
const storySchema = new Schema({
  user_id: ObjectId,
  img: String,
  content: String,
  date: {
    type: Date,
    default: new Date(Date.now())
  },
  offset: {
    type: Number,
    default: new Date(Date.now()).getTimezoneOffset()
  },
  is_new: {
    type: Boolean,
    default: true
  }
}, {
	collection: 'stories',
	versionKey: false
});

var storyModel = new mongoose.model('stories', storySchema);
module.exports = storyModel;


