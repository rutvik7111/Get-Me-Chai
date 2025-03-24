import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: String,
    content: String,
    date: { type: Date, default: Date.now },
    userId: String,
    membersOnly: Boolean,
    comments: [
        {
            name: String,
            profilePhoto: String,
            comment: String,
            date: { type: Date, default: Date.now }
        }
    ]
});

const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);
export default Post;