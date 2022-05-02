const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
var privateKey = fs.readFileSync(path.join(__dirname, 'key','private.key'));
var publicKey = fs.readFileSync(path.join(__dirname, 'key','public.crt'));



// var token = jwt.sign({ foo: 'bar' , exp:Math.floor(Date.now() / 1000) + (1 * 60) }, privateKey , {algorithm: 'RS256'} );
// console.log(token);
token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIiLCJleHAiOjE2NTA3ODk4NTAsImlhdCI6MTY1MDc4OTc5MH0.MIQPi_xSu8Zp3dBuhef65OidmxXcJ4jQHpn8ungJQgnurP0yv113JxEmVRt5RXmxxcUyDkNPkzMVplbPaIO4CdTkA7DS-FRtEkcwvpTgPOSsw9mGEHnBYn7Pw_cO2-iUGizpMoQwKAR6eVmfEhrqn7bOguCSQ73jPg8rH_8YPS7xzY8DHiibJMyu1oUfsZ4lgm3BJiz8ixOVjlU6gUR6BlVZaPdf2FUbFoqpZjm-K0qLUMQgao42fJi3ZM_xli2ZS2VCXpElE3glk1yAJ63Hj3SYpdl2AHSw8KwrC30pkKJJ1qa2501ERpLToS9oHy2jN1MKdpjvempWnZjvWwrbDA"
jwt.verify(token, publicKey, { algorithms: ['RS256'] },(err, decoded) => {
	console.log(err);
	console.log(decoded);
})