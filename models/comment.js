const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        default: 0,
        min: 0
    },
    likedBy: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Check if model exists before creating it
const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);
module.exports = Comment;