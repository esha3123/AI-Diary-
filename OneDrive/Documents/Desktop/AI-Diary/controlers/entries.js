const entries = require("../models/schema.js");

module.exports.home=async (req,res)=>{
    const allentries = await entries.find({owner: req.user._id}).sort({ createdAt: -1 }).populate('owner');
    allentries.owner = req.user._id
    res.render("diary/home.ejs", {
    entries: allentries,
    currentUser: req.user
    })
}
module.exports.new=(req,res)=>{
   res.render("diary/new.ejs")
}
module.exports.newcreated=async (req, res) => {
    try {  
        const entryData = req.body.entry;
        // Handle isPrivate checkbox
        if (Array.isArray(entryData.isPrivate)) {
            entryData.isPrivate = entryData.isPrivate[entryData.isPrivate.length - 1] === 'true';
        } else {
            entryData.isPrivate = entryData.isPrivate === 'true';
        }
        // 🔧 IMPORTANT: Assign current user as owner
        entryData.owner = req.user._id;
        const newentries = new entries(entryData);
        const savedEntry = await newentries.save();
        req.flash("success", "Entry created successfully!");
        res.redirect("/AI-diary");    
    } catch (error) {
        console.error("Error creating entry:", error);
        req.flash("error", "Error creating entry");
        res.redirect("/AI-diary/new");
    }
}
module.exports.publicRoute=async (req,res)=>{
   try {
       const publicEntries = await entries.find({ isPrivate: false }).populate('comments').sort({ createdAt: -1 }).populate('owner');
       res.render("diary/public.ejs", { entries: publicEntries, req: req });
   } catch (error) {
       console.error("Error fetching public entries:", error);
       res.render("diary/public.ejs", { entries: [], req: req });
   }
}
module.exports.pubprvtroute=async (req,res)=>{
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
}
module.exports.analytics=(req,res)=>{
   res.render("diary/analytics.ejs")
}