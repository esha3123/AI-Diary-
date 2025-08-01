const express= require("express");
const router = express.Router();
const wrapAsync  = require ("../utils/wrapAsync.js");
const ExpressError  = require ("../utils/ExpressError.js");
const entries = require("../models/schema.js");

router.get("/login",(req,res)=>{
   res.render("diary/login.ejs")
}) 

router.get("/register",(req,res)=>{
   res.render("diary/register.ejs")
})

router.get("/", wrapAsync(async (req,res)=>{
    const allentries = await entries.find({}).sort({ createdAt: -1 });;
    res.render("diary/home.ejs", {entries: allentries})
}))

router.get("/new",(req,res)=>{
   res.render("diary/new.ejs")
})
router.post("/new", wrapAsync(async (req,res)=>{
    try {
        console.log("Request body:", req.body);
        
        // Handle isPrivate field properly - ENSURE DEFAULT
        const entryData = req.body.entry;
        entryData.isPrivate = entryData.isPrivate === 'true' || entryData.isPrivate === true;
        
        // If isPrivate is undefined, default to true (private)
        if (entryData.isPrivate === undefined) {
            entryData.isPrivate = true;
        }
        
        const newentries = new entries(entryData);
        const savedEntry = await newentries.save();
        console.log("Saved entry:", savedEntry);
        res.redirect("/AI-diary");
    } catch (error) {
        console.log("Error saving entry:", error);
        next(error);
    }
}));

router.get("/public", wrapAsync(async (req,res)=>{
   try {
       const publicEntries = await entries.find({ isPrivate: false }).sort({ createdAt: -1 });
       res.render("diary/public.ejs", { entries: publicEntries });
   } catch (error) {
       console.error("Error fetching public entries:", error);
       res.render("diary/public.ejs", { entries: [] });
   }
}))

router.get("/analytics",(req,res)=>{
   res.render("diary/analytics.ejs")
})

router.get("/profile",(req,res)=>{
   res.render("diary/profile.ejs")
})

// Move the dynamic route AFTER all specific routes
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
    entryData.isPrivate = entryData.isPrivate === 'true' || entryData.isPrivate === true;
    // Handle isPrivate field properly
     if (updateData.isPrivate === undefined) {
        entryData.isPrivate = true;
    }
    
    const updatedEntry = await entries.findByIdAndUpdate(id, updateData, {new: true});
    if (!updatedEntry) {
        throw new ExpressError(404, "Entry not found");
    }
    res.redirect(`/AI-diary/${id}`);
}));

module.exports = router;