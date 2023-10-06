module.exports.home = function(req, res){
   console.log(req.cookies);
   // to change cookie value in response
   res.cookie('user_id', 25);
   //return res.end('<h1>express is up for codeal</h1>');
   return res.render('home',{
    title:"Home"
   });
}