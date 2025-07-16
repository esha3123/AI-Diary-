const express= require("express");
const app = express();
// const mongoose=require("mongoose")
// const methodOverride = require("method-override")
const path = require("path");
const ejsMate=require("ejs-mate");
const wrapAsync  = require ("./utils/wrapAsync.js");
const ExpressError  = require ("./utils/ExpressError.js");

// const mongo_url ="mongodb://127.0.0.1:27017/";
// main().then((res)=>{
//     console.log("connected-db");
// })
// .catch((err)=>{
//     console.log(err);
// });
// async function main() {
//    await mongoose.connect(mongo_url)
// }
app.set("view engine","ejs")
app.set("views", path.join(__dirname,"views"))
// app.use(express.urlencoded({extended:true}));
// app.use(methodOverride("_method"))
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin",(req,res,next)=>{
   let {token}=req.query;
   if(token==="eshin"){
    next()}
    throw new ExpressError(403,"Access for admin page is forbidden ")
    
})

app.use((err, req, res, next) => {
  let {status=500,message="something error"}=err;
  res.status(status).send(message);
  next(err);
})

app.get("/admin",(req,res,next)=>{
    res.send("data")
})

app.get("/",(req,res)=>{
   res.render("diary/landing.ejs")
})
app.get("/AI-diary/login",(req,res)=>{
   res.render("diary/login.ejs")
}) 
app.get("/login",(req,res)=>{
   res.render("diary/login.ejs")
}) 
app.get("/AI-diary/register",(req,res)=>{
   res.render("diary/register.ejs")
})
app.get("/register",(req,res)=>{
   res.render("diary/register.ejs")
})
app.get("/AI-diary",(req,res)=>{
   res.render("diary/home.ejs")
})
app.get("/AI-diary/home",(req,res)=>{
   res.render("diary/home.ejs")
})
app.get("/AI-diary/new",(req,res)=>{
   res.render("diary/new.ejs")
})
app.get("/AI-diary/public",(req,res)=>{
   res.render("diary/public.ejs")
})
app.get("/AI-diary/analytics",(req,res)=>{
   res.render("diary/analytics.ejs")
})
app.get("/AI-diary/profile",(req,res)=>{
   res.render("diary/profile.ejs")
})
app.get("/AI-diary/entry-details",(req,res)=>{
   res.render("diary/entry-details.ejs")
})


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

