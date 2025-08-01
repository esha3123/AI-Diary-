const mongoose = require("mongoose");
const schema = mongoose.Schema;

const diarySchema = new schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    mood: {
        type: String,
        required: true,
        enum: ['😂', '😀', '🤗', '😤', '😔', '😰']
    },
    isPrivate: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    comments: [{
        type: schema.Types.ObjectId,
        ref: "Comment",
    }]
});

// Check if model exists before creating it
const entries = mongoose.models.diaryEntries || mongoose.model("diaryEntries", diarySchema);
module.exports = entries;