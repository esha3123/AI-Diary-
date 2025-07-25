const mongoose=require("mongoose")
const schema = mongoose.Schema;

const diarySchema= new schema({
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
    }
});

const entries = mongoose.model("diaryEntries",diarySchema)
module.exports = entries;  