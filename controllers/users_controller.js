const User = require('../models/user');
module.exports.profile =async function(req, res){
   
    console.log(req.cookies.user_id);
   if(req.cookies.user_id){
    try{
       const existUser =await User.findById(req.cookies.user_id);
       if(existUser){
       
        return res.render('users_profile',{
          title:"User Profile",
          user:existUser
          
        });
       }
       console.log('not found');
       return res.redirect('/users/sign-in');
    }catch(err){
      console.error('Error in user creation:', err);
      return res.status(500).send('Internal Server Error');
    }
   }else{
    console.log('didnt');
    return res.redirect('/users/sign-in');
   }
} 


// render the sign up page
module.exports.signUp = function(req, res){
    return res.render('user_sign_up', {
        title:"Codeal | Sign UP"
    })
}

// render the sign in page
module.exports.signIn = function(req, res){
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
module.exports.createSession = async function(req, res){
    //steps to make createSession
    //find the user
try{
    const existingUser = await User.findOne({ email: req.body.email });

        //handle user found

    if(existingUser){
          //handle password which does't match
          if(existingUser.password != req.body.password){
            return res.redirect('back');
          }

         //handle session creation
         res.cookie('user_id', existingUser.id);
         return res.redirect('/users/profile');

    }else{
           //handle user not found
           return res.redirect('back');
    }

}catch(err){
    console.error('Error in user creation:', err);
    return res.status(500).send('Internal Server Error');
}
   

  

 
}