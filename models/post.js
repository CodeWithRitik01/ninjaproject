const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content: {
        type:String,
        required:true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    //include the array of ids of all comments in this post schema itself
    comments: [
        {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Comment'
    }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ]
}, {
    timestamps:true
});

postSchema.methods.removePost = async function() {
    return this.deleteOne(); // Use deleteOne() for newer versions
};

const Post = mongoose.model('Post', postSchema);
module.exports = Post;