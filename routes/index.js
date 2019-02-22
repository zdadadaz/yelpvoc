const express = require("express");
const User = require("../models/user");
const voclist = require("../models/voclist");
const passport = require("passport");
var router = express.Router();
const middleware = require("../middleware");


// root route
router.get("/", function (req, res) {
    res.render("landing");
})

// show register form
router.get("/register", function (req, res) {
    res.render("register",{page:'register'});
})
// handling register
router.post("/register", function (req, res) {
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar
    });
    //debug approach
    // eval(require('locus'));
    if(req.body.adminCode === process.env.adminCode){
        newUser.isAdmin = true;
        User.register(newUser, req.body.password, function (err, user) {
            if (err) {
                // console.log(err);
                req.flash("error", err.message);
                res.redirect("/register");
                // res.render("register",{err:err.message});
            }
            passport.authenticate("local")(req, res, function () {
                req.flash("success", "Welcome to YelpVoc " + user.username);
                res.redirect("/voclist");
            })
        })
    }else{
        req.flash("error", "Sorry, we have not opened yet");
        res.redirect("/voclist");
    }
})

//show login form
router.get("/login", function (req, res) {
    res.render("login",{page:'login'});
})
router.post("/login", passport.authenticate("local", {
    successRedirect: "/voclist",
    failureRedirect: "/login"
}), function (req, res) {
})

//logout
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success","Logged you out");
    res.redirect("/voclist");
})

//user profile
router.get("/users/:id", function (req, res) {
    User.findById(req.params.id,function(err,foundUser){
        if(err){
            req.flash("error","Something went wrong");
            res.redirect("/");
        }
        voclist.find().where('author.id').equals(foundUser._id).exec(function(err,voc){
            if(err){
                req.flash("error","Something went wrong");
                return res.redirect("/");
            }
            res.render("users/show", {
                user: foundUser,
                voclist:voc
            });
        })
    })
})

module.exports = router;
