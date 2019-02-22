const express = require("express");
var router = express.Router();
const voclist = require("../models/voclist");
const middleware = require("../middleware");
const multer = require("multer");
var cloudinary = require('cloudinary');

// upload image to cloudinary
var storage = multer.diskStorage({
    filename: function(req,file,callback){
        callback(null,Date.now() + file.originalname);
    }
})
var imageFilter = function (req, file, cb) {
    // accept image files only
    console.log("image filename:", file.originalname);
    
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    // if (isNAN(file.originalname) || typeof file.originalname === 'undefined'){
    //     return cb(new Error('Filename is wrong'),false)
    // }
    cb(null, true);
};
var upload = multer({
    storage: storage,
    fileFilter: imageFilter
})

cloudinary.config({
    cloud_name: 'zdadadaz',
    api_key: '591865786259729',
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// get all vocs
router.get("/", function (req, res) {
    var noMatch = null;     
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;

    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all campgrounds from DB
        voclist.find({
            word: regex
        },function (err, allvoclist) {
            if (err) {
                console.log(err);
            } else {
                if (allvoclist.length < 1) {
                    noMatch = "No vocabulary match that query, please try again.";
                }
                res.render("voclist/index", {
                    voclist: allvoclist,
                    noMatch: noMatch
                });
            }
        });
     }else{
         // Get all campgrounds from DB
         voclist.find({}, function (err, allvoclist) {
             if (err) {
                 console.log(err);
             } else {
                 res.render("voclist/index", {
                     voclist: allvoclist,
                     noMatch: noMatch
                 });
             }
         });
        // voclist.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allvoc) {
        //     voclist.countDocuments().exec(function (err, count) {
        //         if (err) {
        //             console.log(err);
        //         } else {
        //             res.render("voclist/index", {
        //                 voclist: allvoc,
        //                 current: pageNumber,
        //                 pages: Math.ceil(count / perPage),
        //                 page:'voclist'
        //             });
        //         }
        //     });
        // });
    }
    
});
// create new voc & upload image
// router.post("/", middleware.isLoggedIn, function (req, res) {
router.post("/", middleware.isLoggedIn, upload.single('image'),async function (req, res) {
   if(req.file){
       try{
            var result = await cloudinary.v2.uploader.upload(req.file.path);
            // add cloudinary url for the image to the voclist object under image property
            req.body.voclist.img = result.secure_url;
            // add image's public_id to voclist object
            req.body.voclist.imageId = result.public_id;
            // add author to voclist
        } catch (err) {
            req.flash('error', err.message);
            return res.redirect('back');
        }
            
    }
    req.body.voclist.author = {
        id: req.user._id,
        username: req.user.username
    }
    voclist.create(req.body.voclist, function (err, voc) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        res.redirect('/voclist/' + voc.id);
    });

    
});

// new - show form to create new voc
router.get("/new", middleware.isLoggedIn
       , function (req, res) {
    res.render("voclist/new.ejs")
})
//show
router.get("/:id", function (req, res) {
    voclist.findById(req.params.id).populate("comments").exec(function (err, foundvoc) {
        if (err) {
            console.log(err);
        } else {
            res.render("voclist/show", {
                voc: foundvoc
            });
        }
    });
})
// edit
router.get("/:id/edit", middleware.checkVoclistOwnership, function (req, res) {
    voclist.findById(req.params.id, function (err, foundvoc) {
        res.render("voclist/edit", {
            voclist: foundvoc
        });
        
    });
});
// update
router.put("/:id", middleware.checkVoclistOwnership, upload.single('image'), function (req, res) {
    voclist.findById(req.params.id, async function(err, voc) {
        if(err){
            req.flash("error",err.message);
            res.redirect("/voclist");
        }else{
            if (req.file) {
                if(voc.imageId){
                    try{
                        await cloudinary.v2.uploader.destroy(voc.imageId);                        
                    } catch (err) {
                        req.flash("error", err.message);
                        res.redirect("/voclist");
                    }
                }
                try{
                    var result = await cloudinary.v2.uploader.upload(req.file.path);
                    voc.imageId = result.public_id;
                    voc.img = result.secure_url;
                } catch(err){
                    req.flash("error", err.message);
                    res.redirect("/voclist");
                }
            }
            voc.word = req.body.word;
            voc.enDefinition = req.body.enDefinition;
            voc.weight = req.body.weight;
            voc.save();
            req.flash("success","Successfully Updated!");
            res.redirect("/voclist/" + req.params.id );
        }
    })
})
router.delete("/:id", middleware.checkVoclistOwnership,function (req, res) {
    voclist.findByIdAndDelete(req.params.id,function(err){
        if(err){
            res.redirect("/voclist");
        }else{
            res.redirect("/voclist");
        }
    })
    // res.send("Delete");
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;