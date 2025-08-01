const express= require("express");
const router = express.Router({mergeParams: true});
const wrapAsync  = require ("../utils/wrapAsync.js");
const ExpressError  = require ("../utils/ExpressError.js");
const entries = require("../models/schema.js");
const Comment = require("../models/comment.js");


//addd
router.post("/", wrapAsync(async (req, res) => {
    let foundentries = await entries.findById(req.params.id);
    let newcomment = new Comment(req.body.comment);
    foundentries.comments.push(newcomment);
    await newcomment.save();
    await foundentries.save();
    res.redirect(`/AI-diary/${req.params.id}`);
}))
//like
router.patch("/:commentId/like", wrapAsync(async (req, res) => {
    let {id, commentId} = req.params;
    await Comment.findByIdAndUpdate(commentId, {$inc: {count: 1}});
    res.redirect(`/AI-diary/${id}`);
}));
//dislike
router.patch("/:commentId/unlike", wrapAsync(async (req, res) => {
    let {id, commentId} = req.params;
    let comment = await Comment.findById(commentId);
    if(comment.count > 0) {
        await Comment.findByIdAndUpdate(commentId, {$inc: {count: -1}});
    }
    res.redirect(`/AI-diary/${id}`);
}));
//delete
router.delete("/:commentId", wrapAsync(async (req, res) => {
    let {id, commentId} = req.params;
    await entries.findByIdAndUpdate(id, {$pull: {comments: commentId}});
    await Comment.findByIdAndDelete(commentId); 
    res.redirect(`/AI-diary/${id}`);
}));

module.exports = router;
