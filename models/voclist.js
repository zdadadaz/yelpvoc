const mongoose = require("mongoose");

var voclistSchema = new mongoose.Schema({
    word: String,
    img: String,
    enDefinition: String,
    weight: Number,
    imageId: String,
    createdAt:{
        type: Date,
        default: Date.now()
    },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

var voclist = mongoose.model("Voclist", voclistSchema);

module.exports=voclist;