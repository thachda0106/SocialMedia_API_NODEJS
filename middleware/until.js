const express = require("express");
const bcrypt = require('bcrypt');
let saltRounds = 10;

function encrtPassword (password){

	bcrypt.genSalt(saltRounds, function(err, salt) {
		bcrypt.hash(password, salt)
		.then(hash => {
		})
		.catch(err => console.error(err))
	})
}


function checkPassword (hash, password) {
	bcrypt.compare(hash,password)
	.then(result => {
		return result;
	})
	.catch(err =>{
		console.log(err);
	})
}	

	// let hash,password = "12314";
	// bcrypt.genSalt(saltRounds, function(err, salt) {
	// 	bcrypt.hash(password, salt)
	// 	.then(hash1 => {
	// 		console.log(hash1);
	// 	})
	// 	.catch(err => console.error(err))
	// })
	bcrypt.compare("12314","$2b$10$tDLvdNWojWTMlkn7zYOOw.bgQH/c2LnX4vTp41T8huUKCpuW3EPn6")
	.then(result => {
		console.log(result);

		new Date( post.date.getTime() -  ( post.offset  * 60000 ))
	})
	.catch(err =>{
		console.log(err);
	})

module.express = {
	encrtPassword,
	checkPassword
}