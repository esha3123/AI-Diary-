const express= require("express");
const router = express.Router();
const wrapAsync  = require ("../utils/wrapAsync.js");
const ExpressError  = require ("../utils/ExpressError.js");
const entries = require("../models/schema.js");
const { isLoggedin } = require("../utils/middleware.js");
const controllerentries=require("../controlers/entries.js")

// router.get("/login",(req,res)=>{
//    res.render("diary/login.ejs")
// }) 

// router.get("/register",(req,res)=>{
//    res.render("diary/register.ejs")
// })

router
    .route("/")
    .get(isLoggedin, wrapAsync(controllerentries.home))

router
    .route("/new")
    .get((controllerentries.new))
    .post( isLoggedin, wrapAsync(controllerentries.newcreated));

router
    .route("/public")
    .get( wrapAsync(controllerentries.publicRoute))

router  
    .route("/public/id")
    .get( wrapAsync(controllerentries.pubprvtroute))

router
   .route("/analytics")
   .get(controllerentries.analytics)

router.get("/profile",(req,res)=>{
   res.render("diary/profile.ejs")
})

// Like post route
router.patch("/:id/like", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let userId = req.ip || 'anonymous_user'; // Using IP as user identifier for now
    
    try {
        const entry = await entries.findById(id);
        if (!entry) {
            return res.status(404).json({ error: "Entry not found" });
        }
        
        // Check if user already liked this post
        if (!entry.likedBy.includes(userId)) {
            await entries.findByIdAndUpdate(id, {
                $inc: { likes: 1 },
                $push: { likedBy: userId }
            });
            res.json({ success: true, action: 'liked', likes: entry.likes + 1 });
        } else {
            res.json({ success: false, message: 'Already liked' });
        }
    } catch (error) {
        res.status(500).json({ error: "Error liking post" });
    }
}));

// Unlike post route
router.patch("/:id/unlike", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let userId = req.ip || 'anonymous_user'; // Using IP as user identifier for now
    
    try {
        const entry = await entries.findById(id);
        if (!entry) {
            return res.status(404).json({ error: "Entry not found" });
        }
        
        // Check if user has liked this post
        if (entry.likedBy.includes(userId)) {
            await entries.findByIdAndUpdate(id, {
                $inc: { likes: -1 },
                $pull: { likedBy: userId }
            });
            res.json({ success: true, action: 'unliked', likes: Math.max(0, entry.likes - 1) });
        } else {
            res.json({ success: false, message: 'Not liked yet' });
        }
    } catch (error) {
        res.status(500).json({ error: "Error unliking post" });
    }
}));

// View entry - only owner can view
router.get("/:id", isLoggedin, wrapAsync(async (req, res) => {
    let {id} = req.params;
    
    // Find entry and check if current user owns it
    const entriesItem = await entries.findOne({ 
        _id: id, 
        owner: req.user._id  // Only find if user owns it
    }).populate('owner');
    
    if (!entriesItem) {
        req.flash("error", "Entry not found or you don't have permission to view it!");
        return res.redirect("/AI-diary");
    }
    
    res.render("diary/entry-details.ejs", {entry: entriesItem})
}))

// Edit entry - only owner
router.get("/:id/edit", isLoggedin, wrapAsync(async (req, res) => {
    let {id} = req.params;
    
    const entryDetails = await entries.findOne({ 
        _id: id, 
        owner: req.user._id 
    });
    
    if (!entryDetails) {
        req.flash("error", "Entry not found or you don't have permission to edit it!");
        return res.redirect("/AI-diary");
    }
    
    res.render("diary/edit.ejs", {entry: entryDetails});
}));

// Update entry - only owner
router.put("/:id", isLoggedin, wrapAsync(async (req, res) => {
    let {id} = req.params;
    const updateData = req.body;
    
    // Handle isPrivate field properly
    if (updateData.isPrivate) {
        updateData.isPrivate = updateData.isPrivate === 'true';
    }

    // Only update if user owns the entry
    const updatedEntry = await entries.findOneAndUpdate(
        { _id: id, owner: req.user._id }, 
        updateData, 
        {new: true}
    );
    
    if (!updatedEntry) {
        req.flash("error", "Entry not found or you don't have permission to edit it!");
        return res.redirect("/AI-diary");
    }
    
    req.flash("success", "Entry updated successfully!");
    res.redirect(`/AI-diary/${id}`);
}));

// Delete entry - only owner
router.delete("/:id", isLoggedin, wrapAsync(async (req, res) => {
    let {id} = req.params;
    
    // Only delete if user owns the entry
    const deletedEntry = await entries.findOneAndDelete({ 
        _id: id, 
        owner: req.user._id 
    });
    
    if (!deletedEntry) {
        req.flash("error", "Entry not found or you don't have permission to delete it!");
        return res.redirect("/AI-diary");
    }
    
    req.flash("success", "Entry deleted successfully!");
    res.redirect("/AI-diary")
}))

module.exports = router;