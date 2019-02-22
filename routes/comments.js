const express = require("express");
const voclist = require("../models/voclist");
const Comment = require("../models/comment");
var router = express.Router({mergeParams:true});
const middleware = require("../middleware");

// share params with voclist

router.get("/new", middleware.isLoggedIn, function (req, res) {
    voclist.findById(req.params.id, function (err, voc) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {
                voclist: voc
            });
        }
    })

})
// add comment
router.post("/", middleware.isLoggedIn, function (req, res) {
    voclist.findById(req.params.id, function (err, voc) {
        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong");
            res.redirect("/voclist")
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    voc.comments.push(comment);
                    voc.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/voclist/" + voc._id);
                }
            })
        }
    })
})
// get edit page
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit", {
                voclist_id: req.params.id,
                comment: foundComment
            });            
        }
    })
})
// comment update
router.put("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updateComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/voclist/"+ req.params.id);
        }
    })
})

//comment destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/voclist/" + req.params.id);
        }
    })
})

module.exports = router;
