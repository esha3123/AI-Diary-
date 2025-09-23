const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const User = require("../models/user.js")
const passport =require("passport")
const {saveredirectUrl}=require("../utils/middleware.js")
const { sendWelcomeEmail, sendVerificationEmail, generateEmailToken } = require("../utils/emailService.js");

// Custom authentication middleware for better error messages
const customAuthenticate = (req, res, next) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        req.flash("error", "Please provide both username and password.");
        return res.redirect("/AI-diary/login");
    }
    
    // Use passport authenticate with custom callback
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            req.flash("error", "An error occurred during login. Please try again.");
            return res.redirect("/AI-diary/login");
        }
        
        if (!user) {
            // Check if username exists
            return User.findOne({ username }).then(existingUser => {
                if (!existingUser) {
                    req.flash("error", "Username not found. Please check your username or register for a new account.");
                } else {
                    req.flash("error", "Incorrect password. Please try again.");
                }
                return res.redirect("/AI-diary/login");
            }).catch(() => {
                req.flash("error", "Invalid username or password. Please try again.");
                return res.redirect("/AI-diary/login");
            });
        }
        
        // Login successful
        req.logIn(user, (err) => {
            if (err) {
                req.flash("error", "Login failed. Please try again.");
                return res.redirect("/AI-diary/login");
            }
            
            req.flash("success", "Welcome back to AI Diary!");
            const redirect = res.locals.redirectUrl || "/AI-diary";
            return res.redirect(redirect);
        });
    })(req, res, next);
};

router.get("/register",(req,res)=>{
   res.render("users/register.ejs")
})
router.post("/register",wrapAsync(async(req,res)=>{
 try {
    let {username,email,password}=req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        req.flash("error", "Username already exists. Please choose a different username.");
        return res.redirect("/AI-diary/register");
    }
    
    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        req.flash("error", "Email already registered. Please use a different email or try logging in.");
        return res.redirect("/AI-diary/register");
    }
    
    const newUser = new User({
        username,
        email,
        name: username, // Set name to username initially
        authMethod: 'local'
    });
    let registeredUser = await User.register(newUser,password);
    
    // Send welcome email
    try {
        await sendWelcomeEmail(registeredUser);
        console.log(`Welcome email sent to ${registeredUser.email}`);
    } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail registration if email sending fails
    }
    
    // Auto-login after successful registration
    req.login(registeredUser, (err) => {
        if (err) {
            req.flash("error", "Registration successful but auto-login failed. Please login manually.");
            return res.redirect("/AI-diary/login");
        }
        req.flash("success","Welcome to AI Diary! Registration successful. Check your email for a welcome message!");
        res.redirect("/AI-diary");
    });
    
 } catch (e) {
    let errorMessage = e.message;
    
    // Customize error messages for common issues
    if (e.message.includes("Path `username` is required")) {
        errorMessage = "Username is required.";
    } else if (e.message.includes("Path `email` is required")) {
        errorMessage = "Email is required.";
    } else if (e.message.includes("shorter than the minimum allowed length")) {
        errorMessage = "Password is too short. Please use at least 6 characters.";
    } else if (e.message.includes("User validation failed")) {
        errorMessage = "Invalid user data. Please check your information.";
    }
    
    req.flash("error", errorMessage);
    res.redirect("/AI-diary/register");
 }
}));
router.get("/login",(req,res)=>{
   res.render("users/login.ejs")
});
router.post("/login", saveredirectUrl, customAuthenticate);
router.get("/logout",(req,res,next)=>{
 req.logout((err)=>{
   if (err){
      return next(err);
   }
   req.flash("success","You are logged out successfully")
   res.redirect("/AI-diary/login")
 })
})
module.exports = router;