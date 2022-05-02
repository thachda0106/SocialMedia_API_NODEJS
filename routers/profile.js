const { profile } = require("console");
const express = require("express");
const path = require("path");
var profileRouter = express.Router();
const models = require("../models/user.js")
const profileModel = models.profileModel;
const userModel = models.userModel;
const handle = require("../untils/handle.js");
// method get all profile
profileRouter.get('/',(req, res, next)=> {
	profileModel.find({})
		.populate('user_id')
		.then(data => {
			console.log(data);
			res.status(200).json(data);
		})
		.catch(err => {
			console.log(err);
			res.status(404).json("NOT FOUND!");
		})


})

// get profile user by profile_id

profileRouter.get('/:id',(req, res, next)=> {
	profileModel.find({_id:req.params.id})
		.populate('user_id')
		.then(data => {
			res.status(200).json(data);
		})
		.catch(err => {
			console.log(err);
			res.status(404).json("NOT FOUND!");
		})


})

// method get profile by user_id 
profileRouter.get('/users/:user_id',(req, res, next)=> {
	let user_id = req.params.user_id;
	profileModel.findOne({user_id})
		.populate('user_id')
		.then(data => {
			if(data) res.status(200).json(data);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json("NOT FOUND!");
		})
})

// post them profile user 
profileRouter.post('/', async (req, res, next)=> {
	

	const user = await userModel.findOne({_id:user_id})
	if(user) {
		const profile = await profileModel.findOne({user_id})
		if(profile) res.status("405").json("profile cua user da ton tai!");
		else{
			const profile = await profileModel.create({user_id,first_name,last_name,status_now,email,phone,sex,date_of_birth,avatar})
			if(profile) res.status("200").json(profile);
			else res.status(500).json("ERROR:" + profile)
		}
	}
	else res.status("404").json("User khong ton tai!");
		
})
	
// delete profile by id profile

profileRouter.delete('/:id', async (req, res, next)=>{
	let _id = req.params.id;
	const result = await profileModel.deleteOne({_id});
	if(result.deletedCount > 0) res.status(200).json("Xoa profile user thanh cong!");
	else res.status(404).json("Xoa profile khong thanh cong!" );

})

// delete profile by id user
profileRouter.delete('/users/:id', async (req, res, next)=>{
	let user_id = req.params.id;
	const result = await profileModel.deleteOne({user_id});
	if(result.deletedCount > 0) res.status(200).json("Xoa profile user thanh cong!");
	else res.status(404).json("Xoa profile khong thanh cong!" );

})


// PUT: UPDATE profile by _id 

profileRouter.put('/:id',handle.uploadImg.array('avatar',1)  , async (req, res, next)=>{
	let _id = req.params.id,
	first_name = req.body.first_name,
	phone = req.body.phone,
	last_name = req.body.last_name,
	status_now = req.body.status_now,
	email = req.body.email,
	sex = req.body.sex,
	date_of_birth = req.body.date_of_birth,
	avatar =  req.files[0].path

	const result = await profileModel.findOneAndUpdate({_id}, {first_name,last_name,status_now,email,phone,sex,date_of_birth,avatar});
	if(result) res.status(200).json("update profile user thanh cong!");
	else res.status(404).json("update profile khong thanh cong!" );

})

// PUT: UPDATE profile by user_id
profileRouter.put('/users/:id',handle.uploadImg.array('avatar',1), async (req, res, next)=>{
	let user_id = req.params.id,
	first_name = req.body.first_name,
	phone = req.body.phone,
	last_name = req.body.last_name,
	status_now = req.body.status_now,
	email = req.body.email,
	sex = req.body.sex,
	date_of_birth = req.body.date_of_birth,
	avatar =  req.files[0].path

	const result = await profileModel.findOneAndUpdate({user_id}, {first_name,last_name,status_now,email,phone,sex,date_of_birth,avatar});
	if(result) res.status(200).json("update profile thanh cong!");
	else res.status(404).json("update profile khong thanh cong!" );

})

module.exports = profileRouter;	