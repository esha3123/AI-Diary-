const express= require("express");
const app = express();
const mongoose=require("mongoose")
const methodOverride = require("method-override")
const path = require("path");
const ejsMate=require("ejs-mate");
const wrapAsync  = require ("./utils/wrapAsync.js");
const ExpressError  = require ("./utils/ExpressError.js");

// Load environment variables
require('dotenv').config();
const Comment = require("./models/comment.js");
const entries = require("./models/schema.js");
const entriesRoutes = require("./routes/entries.js")
const commentRoutes = require("./routes/comment.js")
const insightsRoutes = require("./routes/insights.js") // AI insights route
const ttsRoutes = require("./routes/tts.js") // TTS routes
const authRoutes = require("./routes/auth.js") // Social auth routes
const session = require("express-session"); // ADD THIS!
const flash = require("connect-flash");
const passport = require("./config/auth.js"); // Updated to use auth config
const userRoutes=require("./routes/user.js");
const User = require("./models/user.js");



//-----------database connection built---------------------------------
// const mongo_url ="mongodb://127.0.0.1:27017/Dear-diary";
let dburl = process.env.MONGO_DB_ATLAS ;

main().then((res)=>{
    console.log("connected to database: Dear-diary");
    // console.log("Database connection state:", mongoose.connection.readyState);

    // Initialize the database with a test entry if it's empty
    entries.countDocuments().then((count) => {
        if (count === 0) {
            const testEntry = new entries({
                title: "Welcome to AI Diary",
                content: "This is your first diary entry. Feel free to add more!",
                mood: "🤗",
                isPrivate: false,
                likes: 0,
                likedBy: []
            });
            testEntry.save().then(() => console.log("Test entry created"));
        }
    });
})
.catch((err)=>{
    console.log("Database connection error:", err.message);
});

async function main() {
   try {
       await mongoose.connect(dburl);
       console.log("MongoDB connected successfully");
   } catch (error) {
       console.log("MongoDB connection failed:", error);
       throw error;
   }
}
//---------for the appsss--------------------------
app.set("view engine","ejs")
app.set("views", path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(express.json()); // Add JSON body parser for AI insights
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname, "public")));

//---------session configuration--------------------------
const sessionOptions = {
    secret: process.env.SESSION_SECRET || "mysupersecretsecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.use(session(sessionOptions));
app.use(flash());

//---------passport configuration--------------------------
app.use(passport.initialize());
app.use(passport.session());
// Note: Passport strategies are now configured in config/auth.js

//---------flash middleware--------------------------
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

//-----------routing----------------------------------
// Landing page route (must come before other routes)
app.get("/", wrapAsync(async (req,res,next)=>{
    res.render("diary/landing.ejs") 
}));

// Social Authentication routes
app.use("/auth", authRoutes);

// User routes MUST come FIRST to avoid being caught by /:id route
app.use("/AI-diary", userRoutes);

// Insights and TTS routes
app.use("/insights", insightsRoutes); // AI insights routes
app.use("/tts", ttsRoutes); // TTS routes

// Comment routes (require authentication) - keep this before entries routes
app.use("/AI-diary/:id/comment", commentRoutes);

// Main entries routes (most require authentication) - this should come LAST
app.use("/AI-diary", entriesRoutes);


//--------error handling-------------------------------
app.use((req,res,next)=>{
next(new ExpressError(404,"page not found"))
})

app.use((err,req,res,next)=>{
let {statusCode=500,message="something went wrong"}=err;
 res.status(statusCode).render("diary/404.ejs");
// res.status(statusCode).send(message);
})

app.listen(5000,()=>{
    console.log("listening on port 5000");
})

