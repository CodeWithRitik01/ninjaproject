const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile =async function(req, res){
    // res.end('<h1>Users profile</h1>');
    const user =await User.findById(req.params.id);
    
    return res.render('users_profile',{
        title:"profile",
        profile_user: user
        
       });
} 


module.exports.update =async function(req, res){
  if(req.user.id == req.params.id){
  
     try{
      let user = await User.findById(req.params.id);
      User.uploadedAvatar(req, res, function(err){
          if(err){console.log('******Multer Error:', err)}

          user.name = req.body.name;
          user.email = req.body.email;

          if(req.file){

            //to delete earlier image 
             if(user.avatar){
              fs.unlinkSync(path.join(__dirname, '..', user.avatar));
             }


            //this is saving the path of the uploaded file into the avatar field in the user.
            user.avatar = User.avatarPath + '/' + req.file.filename;

          }
          user.save();
          return res.redirect('back');
      });
     
     }catch(err){
      req.flash('error', err);
      return res.redirect('back');
     }
     

  }else{
    req.flash('err', 'Unauthorized');
    return res.status(401).send('Unauthorised');
  }
}


// render the sign up page
module.exports.signUp = function(req, res){
    if(req.isAuthenticated()){
      return res.redirect('/users/profile');
    }
    return res.render('user_sign_up', {
        title:"Codeal | Sign UP"
    })
}

// render the sign in page
module.exports.signIn = function(req, res){
  if(req.isAuthenticated()){
    return res.redirect('/users/profile');
 }
    return res.render('user_sign_in', {
        title:"Codeal | Sign IN"
    })
}

//get sign up data
// module.exports.create = function(req, res){
//     if(req.body.password != req.body.password){
//         return res.redirect('back');
//     }

//     User.findOne({email: req.body.email}, function(err, user){
//         if(err){console.log('error in finding user in signing up'); return}


        // if(!user){
        //     User.create(req.body, function(err, user){
        //         if(err){console.log('error in creating user while signing up'); return}
        //           return res.redirect('/users/sign-in');

        //     })

           
        // }else{
        //     return res.redirect('back');
        // }
//     })
// }


module.exports.create = async function (req, res) {
    try {
      if (req.body.password !== req.body.confirm_password) {
        console.log('Passwords do not match:', req.body.password, req.body.confirmPassword);
        return res.redirect('back');
      }
  
      const existingUser = await User.findOne({ email: req.body.email });
  
      if (!existingUser) {
        const newUser = await User.create(req.body);
        console.log('New user created:', newUser);
        return res.redirect('/users/sign-in');
      } else {
        console.log('User already exists:', existingUser);
        return res.redirect('back');
      }
    } catch (err) {
      console.error('Error in user creation:', err);
      return res.status(500).send('Internal Server Error');
    }
  };


 
//sign in and create a session for user
module.exports.createSession = function(req, res){
 
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
  
  
}


module.exports.destroySession = function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success', 'You have logged out!');

    res.redirect('/');
  });
}