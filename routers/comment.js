const { profile } = require("console");
const express = require("express");
const { type } = require("express/lib/response");
const path = require("path");
var commentRouter = express.Router();
const models = require("../models/user.js")
const postModel = models.postModel;
const userModel = models.userModel;
const commentModel = models.commentModel;

// get comments for post
commentRouter.get('/:post_id', async function(req, res, next) {
	let post = await postModel.findOne({_id: req.params.post_id});
	if(post){
		let postComments = post.comments, comments = [];
		for(let _id of postComments){
			comments.push(await commentModel.findOne({_id}));
		}

		for(let comment of comments){
			comment.date = new Date( comment.date.getTime() -  ( comment.offset  * 60000 ));
		}
		res.status(200).json({total: comments.length,comments});
	}else res.status(404).json("NOT FOUND POST!");

})


// get replies comments 
commentRouter.get('/:comment_id/replies', async function(req, res, next) {

	let comment = await commentModel.findOne({_id: req.params.comment_id});
	if(comment){
		res.status(200).send({total: comment.replies.length, replies: comment.replies});
	}else res.status(404).json("NOT FOUND COMMENT!");

})


// them comment cho post
commentRouter.post('/:post_id', async function(req, res, next) {
	let post_id = req.params.post_id, 
	commented_by = req.body.commented_by,
	text = req.body.text,
	date = new Date(Date.now()), 
	offset = date.getTimezoneOffset();

	let post = await postModel.findOne({_id:post_id})
	if(post){
		let postComments = post.comments,
		comment = await commentModel.create({commented_by, text, edited: false, date, offset, replies:[] });
		if(comment){
			let comment_id = comment._id;
			postComments.push(comment_id);
			let post = await postModel.findOneAndUpdate({_id:post_id},{comments:postComments})
			if(post) res.status(200).json("them comment cho post thanh cong!");
			else res.status(500).json("Errors!")

		}
	}else res.status(404).json("NOT FOUND POST!") 
})

// xóa comment cho post 
commentRouter.delete('/:post_id/:comment_id', async (req, res, next) => {
	let post_id = req.params.post_id,
	comment_id = req.params.comment_id;
	// body 
	let post = await postModel.findOne({_id:post_id})
	if(post){
		let postComments = post.comments;
		postComments =  postComments.filter(comment => {
			return comment == comment_id ? false : true;
		})
		
		let result = await commentModel.deleteOne({_id:comment_id});
		if(result.deletedCount > 0){
			let post = await postModel.findOneAndUpdate({_id:post_id},{comments:postComments})
			if(post) res.status(200).json("xóa comment cho post thanh cong!");
			else res.status(500).json("Errors!")

		}else res.status(404).json("NOT FOUND COMMENT!") 
	}else res.status(404).json("NOT FOUND POST!") 
})

// update comments (TEXT)

commentRouter.put('/:comment_id', async function(req, res, next) {
	let comment_id = req.params.comment_id,
	text = req.body.text,
	date = new Date(Date.now()), 
	offset = date.getTimezoneOffset();
	
	let comment = await commentModel.findOneAndUpdate({_id:comment_id}, {edited: true, date, offset, text},{new:true});
	if(comment) res.status(200).json(comment)
	else res.status(404).json("NOT FOUND")
	// body 
})


// update comment replies
commentRouter.put('/:comment_id/replies', async function(req, res, next) {
	let comment_id = req.params.comment_id,
	replied_by = req.body.replied_by,
	text = req.body.text, 
	type = req.body.type,
	_id = req.body.reply_id;

	let comment = await commentModel.findOne({_id:comment_id})
	if(comment) {
		switch(type) {
		case "insert":{
			let commentReplies = comment.replies;
			commentReplies.push({replied_by, text});
			let result = await commentModel.findOneAndUpdate({_id:comment_id}, {replies:commentReplies});
			if(result) res.status(200).json("Them reply cho comment thanh cong!" )
			else res.status(404).json("Errors!");
			
			break;
		}
		case "delete":{
			let commentReplies = comment.replies,
			filterReplies = commentReplies.filter(reply => {
				return (reply._id == _id ? false : true);
			})
			let result = await commentModel.findOneAndUpdate({_id:comment_id}, {replies:filterReplies},{new:true});
			if(result) res.status(200).json("Xóa reply cho comment thanh cong!" )
			else res.status(404).json("Errors!");
			break;
		}
		case "update":{
			let commentReplies = comment.replies,
			filterReplies = commentReplies.map(reply => {
				if (reply._id == _id){
					reply.text = text;
					return reply;
				}else return reply;
			})
			let result = await commentModel.findOneAndUpdate({_id:comment_id}, {replies:filterReplies},{new:true});
			if(result) res.status(200).json("update reply cho comment thanh cong!" )
			else res.status(404).json("Errors!");
			break;
		}
		// code block
		}		
	}else res.status(404).json("NOT FOUND COMMENT!")


})

module.exports = commentRouter;


