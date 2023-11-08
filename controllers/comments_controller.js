const Comment = require('../models/comments');
const Post = require('../models/post');
const commentMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');
const Like = require('../models/like');


module.exports.create = async function(req, res) {
    try {
        let post = await Post.findById(req.body.post);

        if (post) {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            await post.save();
            
            comment = await (await comment.populate('user', 'name email')).populate();
            //commentMailer.newComment(comment);
          

            let job = queue.create('emails', comment).save(function(err){
                if (err){
                    console.log('Error in sending to the queue', err);
                    return;
                }
                console.log('job enqueued', job.id);

            });



            if(req.xhr){
               //similar for comments to fetch the uesr's id!

               return res.status(200).json({
                data: {
                    comment: comment
                },
                message: "Post created!"
               });
            }

            req.flash('success', 'Comment published!');
            return res.redirect('/');
        } else {
            return res.status(404).send('Post not found');
        }
    } catch (err) {
        console.error('Error in creating a comment:', err);
        return res.status(500).send('Error in creating a comment');
    }
}


module.exports.destroy = async function(req, res){
    try{
        const comment = await Comment.findById(req.params.id);
        if(comment.user == req.user.id){
            let postId = comment.post;

             comment.removeComment();
             let post = await Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}});
            
             //change :: destroy the associated likes for this comment
             await Like.deleteMany({likable: comment._id, onModel: 'Comment'});
             
                // send the comment id which was deleted back to the views
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }


            req.flash('success', 'Comment deleted!');
            return res.redirect('back');
        }else{
            return res.redirect('back');
        }
    }catch(err){
        console.error('Error in creating a comment', err);
        return res.status(500).send('Error in creating a comment');
    }
}