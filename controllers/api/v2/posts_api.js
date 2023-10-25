module.exports.index = function(req, res){
    return res.json(200, {
        message: "second list of post",
        posts: []
    })
}