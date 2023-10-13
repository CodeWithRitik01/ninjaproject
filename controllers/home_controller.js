const Post = require('../models/post');

// module.exports.home = function(req, res){
   // console.log(req.cookies);
   // to change cookie value in response
   // res.cookie('user_id', 25);
   //return res.end('<h1>express is up for codeal</h1>');
//    Post.find({}, function(err, posts){

//       return res.render('home',{
//          title:"Codeal | Home",
//          posts:posts
//         });      
//    })
 
// }

module.exports.home = async function(req, res){
   //populate the user of each post
   try {
       const posts = await Post.find({}).populate('user');
       return res.render('home', {
           title: "Codeal | Home",
           posts: posts
       });
   } catch (err) {
       console.error('Error in finding posts:', err);
       return res.status(500).send('Error in finding posts');
   }
}
