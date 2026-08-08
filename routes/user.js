const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/users.js");
const passport = require("passport");

router.get("/signup", (req, res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req, res)=>{
    try{ 
        let {username, email, password} = req.body;
        let newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.flash("success", "Welcome to Wanderlust");
        res.redirect("/listings");
    } catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}));

router.get("/login", (req, res)=>{
    res.render("users/login.ejs");
}); 
// we use the passport.authenticate to authenticate the user
router.post(
    "/login", 
    passport.authenticate("local", {   
        failureRedirect: '/login',
        failureFlash: true
    }),
    wrapAsync(async(req, res)=>{
        req.flash("success", "you are logged in"); 
        res.redirect("/listings");
    })
);

module.exports = router;