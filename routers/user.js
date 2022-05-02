const express = require("express");
const path = require("path");
var userRouter = express.Router();
const models = require("../models/user.js")
const userModel = models.userModel;
const profileModel = models.profileModel;

const bcrypt = require('bcrypt');

const handle = require('../untils/handle.js')

// method get all users

userRouter.get('/',(req, res, next)=> {
	userModel.find({})
		.populate('profile_id')
		.then(data => {
			console.log(data);
			res.status(200).json(data);
		})
		.catch(err => {
			console.log(err);
			res.status(404).json("NOT FOUND!");
		})


})
// get user by id or username
userRouter.get('/:id', (req, res, next) => {
	let username = req.params.id;
	userModel.findOne({ username: username})
		.populate('profile_id')
		.then(data => {
			if(data) res.status(200).json(data);
			else next();
		})
		.catch(err => {
			console.log(err);
			res.status(404).json("NOT FOUND!");
		})
},(req, res, next)=> {
	let id = req.params.id;
	userModel.findOne({ _id: id})
		.populate('profile_id')
		.then(data => {
			res.status(200).json(data);
		})
		.catch(err => {
			console.log(err);
			res.status(404).json("NOT FOUND!");
		})


})

// update user (username , password)
userRouter.put('/:username',async(req, res, next)=> {
	let username = req.params.username;
	let password = req.body.password;
	let status_now = req.body.status_now;

	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(password, salt)
		.then(hash => {
			userModel.findOneAndUpdate(
			{
				username 
			},
			{	
				password:hash, 
				status_now
			})
			.then(data => {
				res.status(200).json("update user thành công!");

			})
			.catch(err => {
				console.log(err);
				res.status(500).json("ERRORS!");
			})
		})
		.catch(err => console.error(err))
	})

})


// update user profile 

userRouter.put('/profile/:username',handle.uploadImg.array('avatar',1), async (req, res, next) => {
	let username = req.params.username;
	let first_name = req.body.first_name,
	phone = req.body.phone,
	last_name = req.body.last_name,
	email = req.body.email,
	sex = req.body.sex,
	date_of_birth = req.body.date_of_birth,
	avatar =  req.files[0].path

	let user = await userModel.findOne({ username});
	if(user){
		let profile_id = user.profile_id;
		profileModel.findOneAndUpdate({_id:profile_id},{first_name,phone,last_name,email,sex,date_of_birth,avatar})
			.then(data => {
				res.status(200).json("update user profile thành công!");

			})
			.catch(err => {
				console.log(err);
				res.status(500).json("ERRORS!");
			})
	}else{
		res.status(404).json("NOT FOUND USER!");
	}
})

// insert user
userRouter.post('/',handle.uploadImg.array('avatar',1),async (req, res, next)=> {
	let username = req.body.username,
	password = req.body.password,
	first_name = req.body.first_name,
	phone = req.body.phone,
	last_name = req.body.last_name,
	email = req.body.email,
	sex = req.body.sex,
	date_of_birth = req.body.date_of_birth,
	avatar =  req.files[0].path
	 
	let user = await userModel.findOne({username})
	if(user) res.status(405).json("USER DA TON TAI!")
	else{
		let profile = await profileModel.create({first_name,phone,last_name,email,sex,date_of_birth,avatar});
		let profile_id = profile._id;
		bcrypt.genSalt(10, function(err, salt) {
					bcrypt.hash(password, salt)
					.then(hash => {
						userModel.create({
							username, password:hash, type: 'user', status_now: '',profile_id
						})
						.then(data => {
							res.status(200).json(data);

						})
						.catch(err => {
							console.log(err);
							res.status(500).json("ERRORS!");
						})
					})
					.catch(err => console.error(err))
				})
	}
	
})

// delete user by username
userRouter.delete('/:username',async(req, res, next) => {
	let username = req.params.username;
	let user = await userModel.findOne({username});
	if(user) {
		// xoa profile xong moi xoa user
		let profile_id = user.profile_id;
		let result = await profileModel.deleteOne({_id: profile_id})
		if(result.deletedCount > 0) {
			userModel.deleteOne({ username: username})
				.then(result => {
					if(result.deletedCount == 1) res.status(200).json("Xoa user thanh công!");
					else next();
				})
				.catch(err => {
					console.log(err);
					res.status(404).json("NOT FOUND!");
				})
		}
	}else res.status(404).json("NOT FOUND USER!");


})

module.exports = userRouter;	