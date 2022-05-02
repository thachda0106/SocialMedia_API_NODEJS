
const express = require('express')
var fs = require('fs');
var http = require('http');
var https = require('https');
const app = express()
const port = process.env.PORT || 3000;
const path = require('path');
// app
const handle = require('./untils/handle.js');
// ssl
var privateKey  = fs.readFileSync(path.join(__dirname, 'cert','example.key').toString());
var certificate = fs.readFileSync(path.join(__dirname, 'cert','example.crt').toString());
var credentials = {key: privateKey, cert: certificate};
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var multer = require('multer');
var forms = multer();
// require routers
const userRouter = require('./routers/user.js')
const profileRouter = require('./routers/profile.js')
const postRouter = require('./routers/post.js')
const commentRouter = require('./routers/comment.js')
const followRouter = require('./routers/follow.js')
const authorRoute = require('./routers/autho.js')
const storyRoute = require('./routers/story.js')




// app public static 
app.use('/public', express.static(path.join(__dirname, '/public')))
// app use body-parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// app.use(forms.array('imgs')); 
// app use cookie parser
app.use(cookieParser());

// checkToken login
app.use(handle.checkToken);

// app use routers
app.use('/api/v1/users', userRouter);
app.use('/api/v1/users/following',followRouter);
app.use('/api/v1/posts',postRouter);
app.use('/api/v1/posts/comments',commentRouter);
app.use('/api/v1/author',authorRoute);
app.use('/api/v1/stories',storyRoute);





// your express configuration here

app.get('/', (req, res, next) => {
  res.send('Hello World!')
})

var httpsServer = https.createServer(credentials,app)
httpsServer.listen(port, () => {
  console.log(`Server listening on https://localhost:${port}`)
})

