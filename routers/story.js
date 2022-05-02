const express = require("express");
var storyRouter = express.Router();
const models = require("../models/user.js")
const userModel = models.userModel;
const storyModel = models.storyModel;
const fs = require('fs');

const handle = require("../untils/handle.js");


// get all stories of user_id
storyRouter.get('/:user_id', async (req, res, next) => {
	let user_id = req.params.user_id
	let user = await userModel.findOne({_id:user_id})
	if(user){
		let stories = await storyModel.find({user_id})
		if(stories){
			stories.forEach(story => {
				story.date = new Date( story.date.getTime() -  ( story.offset  * 60000 ));
			});
			res.status(200).json({total: stories.length ,stories})
		} 
		else res.status(500).json("ERRORS")
	}else res.status(404).json("USER NOT FOUND!")
})

// // get stories is_new of user_id
// storyRouter.get('/:user_id', async (req, res, next) => {
// 	let user_id = req.params.user_id
// 	let user = await userModel.findOne({_id:user_id})
// 	if(user){
// 		let stories = await storyModel.find({user_id, is_new:true})
// 		if(stories) res.status(200).json(stories)
// 		else res.status(500).json("ERRORS")
// 	}else res.status(404).json("USER NOT FOUND!")
// })

storyRouter.post('/',handle.uploadStory.array('img', 1), async (req, res, next) => {
	let user_id = req.body.user_id,
	content = req.body.content,
	img = req.files[0].path

	let user = await userModel.findOne({_id:user_id})
	if(user){
		let story = await storyModel.create({user_id,content,img})
		if(story) res.status(200).json(story)
		else res.status(500).json("ERRORS")
	}else res.status(404).json("USER NOT FOUND!")
})

storyRouter.delete('/:_id', async (req, res, next) => {
	let _id = req.params._id
	let result = await storyModel.deleteOne({_id})
	if(result.deletedCount > 0) res.status(200).json("DELTED STORY")
	else res.status(500).json("ERRORS")
})

module.exports = storyRouter;