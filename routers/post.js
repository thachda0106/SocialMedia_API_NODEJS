const { profile } = require("console");
const express = require("express");
const path = require("path");
var postRouter = express.Router();
const models = require("../models/user.js")
const postModel = models.postModel;
const commentModel = models.commentModel;

const handle = require("../untils/handle.js");

// get all posts
postRouter.get('/', async (req, res, next) => {
	var posts =  await postModel.find({}).populate({path:'comments',populate:{path: 'commented_by'}})
	if(posts) {
		posts.forEach(post => {
			post.date = new Date( post.date.getTime() -  ( post.offset  * 60000 ));
		});
		res.status(200).json({total: posts.length ,posts})
	}
	else res.status(404).json("NOT FOUND!")
})

// get all posts by user id
postRouter.get('/users/:id', async (req, res, next) => {
	var posts =  await postModel.find({user_id: req.params.id}).populate({path:'comments',populate:{path: 'commented_by'}})
	if(posts) {
		posts.forEach(post => {
			post.date = new Date( post.date.getTime() -  ( post.offset  * 60000 ));
		});
		res.status(200).json({total: posts.length ,posts})
	}
	else res.status(404).json("NOT FOUND!")
})

// insert posts
postRouter.post('/',handle.uploadPost.array('imgs') , async (req, res, next) => {
	let user_id = req.body.user_id,
	content = req.body.content,
	imgs = req.files.map(img=>img.path)
	date =  new Date(Date.now())
	
	var post = await postModel.create({user_id, content,edited: false ,heart_total: 0 , date, offset: date.getTimezoneOffset() , imgs, comments: []});
	if(post) res.status(200).json(post);
	else res.status(500).json("ERRORS!")
})



// update posts by id  (content, imgs)
postRouter.put('/:post_id',handle.uploadPost.array('imgs'), async (req, res, next) => {
	let _id = req.params.post_id,
	content = req.body.content,
	imgs = req.files.map(img=>img.path)
	date =  new Date(Date.now());
	
	let post = await postModel.findOneAndUpdate({_id},{content, imgs, edited: true, date, offset: date.getTimezoneOffset() },{new: true});
	if(post) res.status(200).json(post);
	else res.status(404).json("NOT FOUND!")
})

// update minus heart_total for post
postRouter.put('/:post_id/heart-minus', async (req, res, next) => {
	let _id = req.params.post_id;
	let post = await postModel.findOne({_id});
	
	if(post){
		let heart_total = post.heart_total;
		if(heart_total){
			postModel.findOneAndUpdate({_id},{heart_total: --heart_total},{new: true})
			.then(data => {
				res.status(200).json(data);
			})
			.catch(error => {
				res.status(500).json(error);
			})
		}else res.status(405).json("HEART TOTAL: 0! CAN'T MINUS!")
	}
	else res.status(404).json("NOT FOUND!")
})

// update plus heart_total posts
postRouter.put('/:post_id/heart-plus', async (req, res, next) => {
	let _id = req.params.post_id;
	let post = await postModel.findOneAndUpdate({_id},{$inc : {'heart_total' : 1}},{new: true} )
	if (post) res.status(200).json(post)
	else res.status(500).json("NOT FOUND!")
})

// delete post by id

postRouter.delete('/:id', async (req, res, next) => {
	let _id = req.params.id;
	let post = await postModel.findOne({_id});

	if(post) {
		let postComments = post.comments;
		for(let commentID of postComments) {
			await commentModel.deleteOne({_id: commentID})
		}
		let result = await postModel.deleteOne({_id: _id})
		if(result.deletedCount > 0) res.status(200).json("DELETED POST!");
		else res.status(404).json("ERRORS!")

			
	}else res.status(404).json("NOT FOUND POST!")

})

module.exports = postRouter;



