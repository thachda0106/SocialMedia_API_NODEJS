const express = require("express");
var authorRoute = express.Router();
const models = require("../models/user.js")
const userModel = models.userModel;
const profileModel = models.profileModel;
const path = require('path');
const jwt = require('jsonwebtoken');
const fs = require('fs');
var privateKey = fs.readFileSync(path.join(path.dirname(__dirname), './key/private.key'));
var publicKey = fs.readFileSync(path.join(path.dirname(__dirname), './key/public.crt'));
const bcrypt = require('bcrypt');


const handle = require("../untils/handle.js");

authorRoute.get('/login', async (req, res, next) => {
	console.log(req);
	let username = req.body.username,
	password = req.body.password;
	
	console.log({username,password});

	let user = await userModel.findOne({username})
	if(user){
		if(bcrypt.compareSync(password ,user.password)) {
			var token = jwt.sign({ user , exp:Math.floor(Date.now() / 1000) + (30 * 60) }, privateKey , {algorithm: 'RS256'} );
			res.status(200).json({token})
		}
		else res.status(405).json("INVALID PASSWORD")
	}else res.status(404).json("NOT FOUND USER");
})


// insert user
authorRoute.post('/register',handle.uploadImg.array('avatar',1) ,async (req, res, next)=> {
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

// authorRoute.post('/upload', handle.uploadImg.array('imgs', 2) , function(req, res , next) {
// 	console.log(req.files[0],req.body)
// 	res.json('success') 
// })


module.exports = authorRoute;