const passport = require('passport');

 const LocalStrategy = require('passport-local').Strategy;




const User = require('../models/user');



//authentication using passport


// var strategy = new LocalStrategy(function verify(email, password, cb) {
//     db.get('SELECT * FROM users WHERE username = ?', [ email ], function(err, user) {
//       if (err) { return cb(err); }
//       if (!user) { return cb(null, false, { message: 'Incorrect username or password.' }); }
  
//       crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
//         if (err) { return cb(err); }
//         if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
//           return cb(null, false, { message: 'Incorrect username or password.' });
//         }
//         return cb(null, user);
//       });
//     });
//   });

passport.use(new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true
}, async function(req, email, password, done) {
  try {
    const user = await User.findOne({ email: email });

    if (!user || user.password != password) {
     // console.log('Invalid Username/Password');
      req.flash('error', 'Invalid Username/Password');
      return done(null, false);
    }

    return done(null, user);
  } catch (err) {
   // console.log('Error in finding user --> Passport');
     req.flash('error', err);
    return done(err);
  }
}));



//serrializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});

//deserializing the user from the key in the cookies
// passport.deserializeUser(function(id, done){
//     User.findById(id, function(err, user){
//         if(err){
//             console.log('Error in finding user --> passpost');
//             return done(err);
//         }
    
//         return done(null, user);
//     });
  
// });
passport.deserializeUser(async function(id, done) {
  try {
      const user = await User.findById(id);
      if (!user) {
          return done(null, false); // User not found
      }
      return done(null, user);
  } catch (err) {
      console.log('Error in finding user --> passport');
      return done(err);
  }
});


//check if the user is authenticated
passport.checkAuthentication = function(req, res, next){
  //if the user is signed in, then pass on the request to the next function(controller's action)
  if(req.isAuthenticated()){
    return next();
  }

  //if the user is not signed in 
  return res.redirect('/user/sign-in');
}

//to find user by id
passport.setAuthenticatedUser = function(req, res, next){
  if(req.isAuthenticated()){
    //req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views.
    res.locals.user = req.user;
  }
  next();
}

module.exports = passport;