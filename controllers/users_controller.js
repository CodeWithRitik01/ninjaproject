module.exports.profile = function(req, res){
    // res.end('<h1>Users profile</h1>');
    return res.render('users_profile',{
        title:"profile"
       })
} 