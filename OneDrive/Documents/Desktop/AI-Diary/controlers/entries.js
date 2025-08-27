const entries = require("../models/schema.js");

module.exports.home = async (req, res) => {
    try {
        const allentries = await entries.find({ owner: req.user._id }).sort({ createdAt: -1 }).populate('owner');
        
        // Calculate analytics data
        const totalEntries = allentries.length;
        const currentStreak = calculateCurrentStreak(allentries);
        const daysActive = calculateDaysActive(allentries);
        const wordStats = calculateWordStats(allentries);
        const moodDistribution = calculateMoodDistribution(allentries);
        
        const analytics = {
            totalEntries,
            currentStreak,
            daysActive,
            wordStats,
            moodDistribution
        };
        
        res.render("diary/home.ejs", {
            entries: allentries,
            currentUser: req.user,
            analytics: analytics
        });
    } catch (error) {
        console.error("Error fetching home data:", error);
        req.flash("error", "Error loading dashboard");
        res.redirect("/");
    }
}

// Helper functions for analytics
function calculateCurrentStreak(entries) {
    if (entries.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    const sortedEntries = entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    for (let i = 0; i < sortedEntries.length; i++) {
        const entryDate = new Date(sortedEntries[i].createdAt);
        const daysDiff = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === i || (i === 0 && daysDiff <= 1)) {
            streak++;
        } else {
            break;
        }
    }
    
    return streak;
}

function calculateDaysActive(entries) {
    if (entries.length === 0) return 0;
    
    const uniqueDates = new Set();
    entries.forEach(entry => {
        const date = new Date(entry.createdAt).toDateString();
        uniqueDates.add(date);
    });
    
    return uniqueDates.size;
}

function calculateWordStats(entries) {
    if (entries.length === 0) {
        return {
            totalWords: 0,
            avgWordsPerEntry: 0,
            longestEntry: 0
        };
    }
    
    let totalWords = 0;
    let longestEntry = 0;
    
    entries.forEach(entry => {
        const wordCount = entry.content ? entry.content.split(/\s+/).length : 0;
        totalWords += wordCount;
        if (wordCount > longestEntry) {
            longestEntry = wordCount;
        }
    });
    
    return {
        totalWords,
        avgWordsPerEntry: Math.round(totalWords / entries.length),
        longestEntry
    };
}

function calculateMoodDistribution(entries) {
    const moodMap = {
        '😊': { name: 'Happy', emoji: '😊', count: 0 },
        '😔': { name: 'Sad', emoji: '😔', count: 0 },
        '😰': { name: 'Anxious', emoji: '😰', count: 0 },
        '😤': { name: 'Angry', emoji: '😤', count: 0 },
        '🤗': { name: 'Grateful', emoji: '🤗', count: 0 },
        '😐': { name: 'Neutral', emoji: '😐', count: 0 }
    };
    
    entries.forEach(entry => {
        const mood = entry.mood || '😐';
        if (moodMap[mood]) {
            moodMap[mood].count++;
        }
    });
    
    return Object.values(moodMap);
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
module.exports.analytics = async (req, res) => {
    try {
        const userEntries = await entries.find({ owner: req.user._id }).sort({ createdAt: -1 });
        
        // Calculate detailed analytics
        const analytics = {
            totalEntries: userEntries.length,
            currentStreak: calculateCurrentStreak(userEntries),
            daysActive: calculateDaysActive(userEntries),
            wordStats: calculateWordStats(userEntries),
            moodDistribution: calculateMoodDistribution(userEntries)
        };
        
        res.render("diary/analytics.ejs", {
            entries: userEntries,
            analytics: analytics,
            currentUser: req.user
        });
    } catch (error) {
        console.error("Error fetching analytics:", error);
        req.flash("error", "Error loading analytics");
        res.redirect("/AI-diary");
    }
}