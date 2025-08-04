const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const user = require("../models/user.js")
const passport =require("passport")
const {saveredirectUrl}=require("../utils/middleware.js")

router.get("/register",(req,res)=>{
   res.render("users/register.ejs")
})
router.post("/register",wrapAsync(async(req,res)=>{
 try {
    let {username,email,password}=req.body;
 const newUser = new user({username,email});
  let registeredUser = await user.register(newUser,password);
//   req.flash("success","welcome to the wanderlust")
  res.redirect("/AI-diary");
 } catch (e) {
    req.flash("error",e.message)
    res.redirect("/AI-diary/register");
 }
}));
router.get("/login",(req,res)=>{
   res.render("users/login.ejs")
});
router.post("/login",saveredirectUrl,passport.authenticate("local",{failureRedirect:"/AI-diary/login",failureFlash:true}),(req,res)=>{
    req.flash("success","welcome back to the wanderlust")
    let redirect = res.locals.redirectUrl || "/AI-diary"
    res.redirect(redirect)
})
router.get("/logout",(req,res,next)=>{
 req.logout((err)=>{
   if (err){
      return next(err);
   }
   // req.flash("sucess","you are logged out")
   res.redirect("/AI-diary/login")
 })
})
module.exports = router;