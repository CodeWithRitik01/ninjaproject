const Comment = require('../models/comments');
const Post = require('../models/post');



module.exports.create = async function(req, res) {
    try {
        const post = await Post.findById(req.body.post).exec();

        if (post) {
            const comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            await post.save();

            return res.redirect('/');
        } else {
            return res.status(404).send('Post not found');
        }
    } catch (err) {
        console.error('Error in creating a comment:', err);
        return res.status(500).send('Error in creating a comment');
    }
}
