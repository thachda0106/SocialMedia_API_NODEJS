const express = require("express");
var followRouter = express.Router();
const models = require("../models/user.js")
const userModel = models.userModel;


// METHOD GET
followRouter.get('/:user_id', async (req, res, next) => {
	let user_id = req.params.user_id
	let user = await userModel.findOne({_id: user_id})
	if(user){
		res.status(200).json({
			'following':user.following,
			'followers':user.followers
		})
	}else res.status(404).json("USER NOT FOUND!")
	
})


// METHOD PUT
 followRouter.put('/:user_id', async (req, res, next) => {
	let type = req.body.type,
	userPartner_ID = req.body.user_id; // foloowing_userID: id nguoi ban se follow
	let user_ID = req.params.user_id;   // user_id: id cua ban
	let user = await userModel.findOne({_id: user_ID});  // user cua ban
	let userPartner = await userModel.findOne({_id: userPartner_ID});  // user ban se follow
	if(user && userPartner){
		let userFollowing = user.following,
		 userFollowers = user.followers,
		 userPartner_Following = userPartner.following,
		 userPartner_Followers = userPartner.followers,
		 isUserPartnerFollowingUser = false
		// kiem tra xem userpartner da theo doi user chua?
		if(userPartner_Following.list.indexOf(user_ID) != -1) isUserPartnerFollowingUser = true;
		
		if(type == 'follow'){
			//
			userPartner_Followers.list.push({user_id: user_ID,followed:isUserPartnerFollowingUser});
			userPartner_Followers.total++
			//
			userFollowing.list.push(userPartner_ID);
			userFollowing.total++
			if(isUserPartnerFollowingUser){
				userFollowers.list = userFollowers.list.map(follower => {
					if(follower.user_id == userPartner_ID){
						follower.followed = true;
					}
					return follower;
				})
			}
			
			
		}else if(type == 'unfollow'){
			userPartner_Followers.list = userPartner_Followers.list.filter(follower => {
				return  (follower.user_id == user_ID ? false:true)
			})
			userPartner_Followers.total = userPartner_Followers.list.length

			// 
			userFollowing.list = userFollowing.list.filter(user_id => {
				return (user_id == userPartner_ID ? false:true)
			})

			userFollowing.total = userFollowing.list.length

			if(isUserPartnerFollowingUser){
				userFollowers.list = userFollowers.list.map(follower => {
					if(follower.user_id == userPartner_ID){
						follower.followed = false;
					}
					return follower;
				})
			}
		}

			let result1 = await userModel.findOneAndUpdate({_id: user_ID},{following: userFollowing, followers:userFollowers},{'new':true})
			let result2 = await userModel.findOneAndUpdate({_id: userPartner_ID},{followers: userPartner_Followers},{'new':true})
			if(result1 && result2) res.status(200).json("success!")
			else res.status(500).json("ERRORS")
	}else res.status(404).json("NOT FOUND USER!")
})

module.exports = followRouter;


