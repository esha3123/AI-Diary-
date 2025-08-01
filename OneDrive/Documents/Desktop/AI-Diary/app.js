const express= require("express");
const app = express();
const mongoose=require("mongoose")
const methodOverride = require("method-override")
const path = require("path");
const ejsMate=require("ejs-mate");
const wrapAsync  = require ("./utils/wrapAsync.js");
const ExpressError  = require ("./utils/ExpressError.js");
const Comment = require("./models/comment.js");
const entries = require("./models/schema.js");
const entriesRoutes = require("./routes/entries.js")
const commentRoutes = require("./routes/comment.js")

//-----------database connection built---------------------------------
const mongo_url ="mongodb://127.0.0.1:27017/Dear-diary";
main().then((res)=>{
    console.log("connected to database: Dear-diary");
    console.log("Database connection state:", mongoose.connection.readyState);
})
.catch((err)=>{
    console.log("Database connection error:", err.message);
});

async function main() {
   try {
       await mongoose.connect(mongo_url);
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
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname, "public")));



//-----------routing----------------------------------
app.get("/", wrapAsync(async (req,res,next)=>{
    res.render("diary/landing.ejs") 
}));
app.use("/AI-diary",entriesRoutes);
app.use("/AI-diary/:id/comment", commentRoutes)



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

