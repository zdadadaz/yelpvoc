require('./config/config');
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const vocdata = require("./data/data"); 
const voclist = require("./models/voclist");
const Comment = require("./models/comment");
const seedDB = require("./seed/seed");
const methodOverride = require("method-override");
const flash = require("connect-flash");
require('dotenv').config()

//requiring routes
var commentRoutes = require("./routes/comments"),
    voclistRoutes = require("./routes/voclist"),
    indexRoutes   = require("./routes/index");

// auth
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

// route
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
})

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
const port = process.env.PORT || 3000;
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); 

//make moment available for all view files
app.locals.moment = require("moment");

// Passport configuration
app.use(require("express-session")({
    secret:"Once again Rusty win cutest dog",
    resave: false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// every route will run this middleware before themselves
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})


// =======
// Routes
// =======

app.use("/voclist",voclistRoutes);

// desh //
// comments route
app.use("/voclist/:id/comments",commentRoutes);

// =======
// Auth Routes
// =======
app.use('/',indexRoutes);

app.listen(port, function () {
    console.log('Yelp server is running')
})