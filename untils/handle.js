
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
var publicKey = fs.readFileSync(path.join(path.dirname(__dirname), './key/public.crt'));

const multer = require('multer');

const storageAvatar = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/imgs/userAvatar');
      },
    filename: function (req, file, cb) {
        cb(null, Date.now()+'_' + file.originalname);
    } 
});

const storagePost = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/imgs/userPost');
      },
    filename: function (req, file, cb) {
        cb(null, Date.now()+'_' + file.originalname);
    } 
});

const storageStory = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/imgs/userStory');
      },
    filename: function (req, file, cb) {
        cb(null, Date.now()+'_' + file.originalname);
    } 
});

const uploadImg = multer({storage:storageAvatar})
const uploadPost = multer({storage:storagePost})
const uploadStory = multer({storage:storageStory})




checkToken = (req, res, next) => {
  if (req.path === '/api/v1/author/login' || req.path === '/api/v1/author/register') {
        return next();
  }else {
    let token = req.headers.token;
     try {
       jwt.verify(token, publicKey, { algorithms: ['RS256'] })
       next();
     } catch (error) {
       res.status(203).json("TOKEN EXPRIED!")
     } 
  }
	
}

module.exports = {
	checkToken,
  uploadImg,
  uploadPost,
  uploadStory
}