const express= require("express");
const router = express.Router();
const wrapAsync  = require ("../utils/wrapAsync.js");
const ExpressError  = require ("../utils/ExpressError.js");
const entries = require("../models/schema.js");
const { isLoggedin } = require("../utils/middleware.js");

// router.get("/login",(req,res)=>{
//    res.render("diary/login.ejs")
// }) 

// router.get("/register",(req,res)=>{
//    res.render("diary/register.ejs")
// })

router.get("/",isLoggedin, wrapAsync(async (req,res)=>{
    const allentries = await entries.find({}).sort({ createdAt: -1 });;
    res.render("diary/home.ejs", {entries: allentries})
}))

router.get("/new",(req,res)=>{
   res.render("diary/new.ejs")
})
router.post("/new", wrapAsync(async (req,res)=>{
     try {  
        const entryData = req.body.entry;
        if (Array.isArray(entryData.isPrivate)) {
            entryData.isPrivate = entryData.isPrivate[entryData.isPrivate.length - 1] === 'true';
        } else {
            entryData.isPrivate = entryData.isPrivate === 'true';
        }
        const newentries = new entries(entryData);
        const savedEntry = await newentries.save();
        res.redirect("/AI-diary");
        
    } catch (error) {
        res.status(500).send("Error creating entry");
    }
}));

router.get("/public", wrapAsync(async (req,res)=>{
   try {
       const publicEntries = await entries.find({ isPrivate: false }).populate('comments').sort({ createdAt: -1 });
       res.render("diary/public.ejs", { entries: publicEntries, req: req });
   } catch (error) {
       console.error("Error fetching public entries:", error);
       res.render("diary/public.ejs", { entries: [], req: req });
   }
}))

router.get("/public/:id", wrapAsync(async (req,res)=>{
   try {
       let {id} = req.params;
       const publicEntry = await entries.findOne({ _id: id, isPrivate: false }).populate('comments');
       if (!publicEntry) {
           throw new ExpressError(404, "Public entry not found");
       }
       res.render("diary/entry-details-public.ejs", { entry: publicEntry, req: req });
   } catch (error) {
       console.error("Error fetching public entry details:", error);
       throw new ExpressError(404, "Entry not found");
   }
}))

router.get("/analytics",(req,res)=>{
   res.render("diary/analytics.ejs")
})

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

// Dynamic routes - MUST be at the end to avoid conflicts with specific routes
router.get("/:id",wrapAsync(async (req,res)=>{
    let{id}=req.params;
    const entriesItem = await entries.findById(id);
    res.render("diary/entry-details.ejs",{entry:entriesItem})
}))

router.delete("/:id",wrapAsync(async(req,res)=>{
    let{id}=req.params;
    const entriesdelete = await entries.findByIdAndDelete(id);
    res.redirect("/AI-diary")
}))

router.get("/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const entryDetails = await entries.findById(id); 
    if (!entryDetails) {
        throw new ExpressError(404, "Entry not found");
    }
    res.render("diary/edit.ejs", {entry: entryDetails});
}));

router.put("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const updateData = req.body;
    
    // Handle isPrivate field properly
    if (updateData.isPrivate) {
        updateData.isPrivate = updateData.isPrivate === 'true';
    }

    const updatedEntry = await entries.findByIdAndUpdate(id, updateData, {new: true});
     res.redirect(`/AI-diary/${id}`);
}));

module.exports = router;