const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');


//tell passport to user a new strategy for google login
passport.use(new googleStrategy({
        clientID:"41568065850-b310fjkmq2m308jtq3n4b3g2q1v980n7.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:8000/users/auth/google/callback",
    },

    async function(accessToken, refreshToken, profile, done){
        //find a user
        try{
            const user = await User.findOne({email: profile.emails[0].value}).exec();
       
            console.log(profile);
     
            if(user){
             //if found, set this user as req.user
             return done(null, user);
            }else{
             //if not found, create the user and set it as req.user
             try{
                const newUser = await User.create({
                    name:profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                });
                return done(null, newUser);
             }catch(err){
                console.log('Error in creating user google strategy-passport', err);
                return done(err);

             }
           
            }

        }catch(err){
            console.log('error in google strategy-passport', err);
            return;
        }
      
    }

));



module.exports = passport;