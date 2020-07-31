const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const User = require('../schemas/userSchema')
const bcrypt = require("bcryptjs");

passport.use(new LocalStrategy({
	usernameField: 'username',
	passwordField: 'password'
},
	function (username, password, cb) {
		User.findOne({ email: username }, async (err, user) => {
			if (err) { 
				console.log(err);
				return cb(err); 
			}
			if (!user) {
				
				return cb(403);
			}
			if (! await bcrypt.compare(password, user.password)) {
				
				return cb(403);
			}
			else {
				
				return cb(null, user);
			}
		});
	}
));

passport.serializeUser(function (user, cb) {	
	cb(null, user);
});

passport.deserializeUser(function (obj, cb) {	
	cb(null, obj);
});


module.exports = passport