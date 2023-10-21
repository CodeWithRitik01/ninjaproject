const Post = require('../models/post');
const Comment = require('../models/comments');

// module.exports.create =async function(req, res){
//     Post.create({
//         content: req.body.content,
//         user: req.user._id
//     }, function(err, post){
//         if(err){console.log('error in creating a post'); return;}
//         return res.redirect('back');
//     });
// }

module.exports.create = async function(req, res){
    try {
        const post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        // this 'if' is made for ajax data collection
        if(req.xhr){
            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post create!"
              
            });
        }

        req.flash('success', 'Post Published');
        return res.redirect('back');
    } catch (err) {
        console.log('Error in creating a post:', err);
        req.flash('error', err);

        return res.status(500).send('Error in creating a post');
    }
}


module.exports.destroy = async function(req, res){
    try{
        const post = await Post.findById(req.params.id);
        //.id means consverting the object id into string
        if(post.user == req.user.id){
            await post.removePost();
            await Comment.deleteMany({post: req.params.id}).exec();

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted "
                });
            }

            req.flash('success', 'Post and assosciated comments are deleted');

           return res.redirect('back');
        }else{
            req.flash('err', 'You can not delete this post');

            return res.redirect('back');
        }
    }catch(err){
        console.error('Error in user creation:', err);
        req.flash('error', err);

        return res.status(500).send('Internal Server Error');
    }
}


