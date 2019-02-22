var voclist = require("../models/voclist");
var Comment = require("../models/comment");
var User = require("../models/user");

var middlewareObj={    
};
middlewareObj.checkVoclistOwnership = function(req, res, next) {
    //is user logged in?
    if (req.isAuthenticated()) {
        voclist.findById(req.params.id, function (err, foundvoc) {
            if (err) {
                console.log(err);
                req.flash("error", "Voc not found");
                res.redirect("back");
            } else {
                // does user own the campground?
                if (foundvoc.author.id.equals(req.user._id)) {
                    next();
                } else {
                    // res.send("you do not have permission to do that.");
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        // console.log("you need to be logged in to do that");
        // res.send("you need to be logged in to do that");
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back"); // previous page

    }
}
middlewareObj.checkUserOwnership = function (req, res, next) {
    //is user logged in?
    if (req.isAuthenticated()) {
        User.findById(req.params.id, function (err, foundUser) {
            if (err) {
                console.log(err);
                req.flash("error", "Voc not found");
                res.redirect("back");
            } else {
                // does user own the campground?
                if (foundUser.id.equals(req.user._id)) {
                    next();
                } else {
                    // res.send("you do not have permission to do that.");
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        // console.log("you need to be logged in to do that");
        // res.send("you need to be logged in to do that");
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back"); // previous page

    }
}
middlewareObj.checkCommentOwnership = function(req, res, next) {
    //is user logged in?
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                console.log(err);
                res.redirect("back");
            } else {
                // does user own the campground?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    // res.send("you do not have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        // console.log("you need to be logged in to do that");
        // res.send("you need to be logged in to do that");
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back"); // previous page

    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash("error","You need to be logged in to do that");
        res.redirect("/login");
    }
}

module.exports = middlewareObj;