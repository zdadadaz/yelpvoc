var mongoose = require("mongoose");
var voclist = require("./../models/voclist");
var Comment = require("./../models/comment");
var User = require("./../models/user");

var data = [{
        word: "Cloud's Rest",
        img: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        enDefinition: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        word: "Desert Mesa",
        img: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        enDefinition: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        word: "Canyon Floor",
        img: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        enDefinition: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]
var user1= {
    username: "zdadadaz5566@gmail.com",
    password:"chiou5917"
}
function seedDB() {
    //Remove all voclists
    User.deleteMany({},function(err){
        if(err){
            console.log(err);
        }else{
            // User.create(user1,function(err,user){
            //     if(err){
            //         console.log(err);
            //     }else{
            //         console.log(user);
            //     }
            // })
        }
    })
    voclist.deleteMany({}, function (err) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     console.log("removed voclists!");
    //     Comment.deleteMany({}, function (err) {
    //         if (err) {
    //             console.log(err);
    //         }
    //         console.log("removed comments!");
    //         //add a few voclists
    //         data.forEach(function (seed) {
    //             voclist.create(seed, function (err, voc) {
    //                 if (err) {
    //                     console.log(err)
    //                 } else {
    //                     console.log("added a voc");
                        //create a comment
                        // Comment.create({
                        //     text: "This place is great, but I wish there was internet",
                        //     author: "Homer"
                        // }, function (err, comment) {
                        //     if (err) {
                        //         console.log(err);
                        //     } else {
                        //         voc.comments.push(comment);
                        //         voc.save();
                        //         console.log("Created new comment");
                        //     }
                        // });
    //                 }
    //             });
    //         });
    //     });
    });
    //add a few comments
}

module.exports = seedDB;