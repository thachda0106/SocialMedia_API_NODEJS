const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
const ObjectId = Schema.ObjectId;
const commentsSchema = new Schema({
  commented_by: {
    type: ObjectId,
    ref: 'users'
  },
  text: String,
  edited: Boolean,
  date: Date,
  offset: Number,
  replies: [{
    replied_by: {
      type: ObjectId,
      ref: 'users' 
    },
    text: String,
  }]
}, {
	collection: 'comments',
	versionKey: false
});

var commentsModel = new mongoose.model('comments', commentsSchema);
module.exports = commentsModel;


