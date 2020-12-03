const mongoose = require('mongoose');

const comments = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    postId:{type:String,required:true},
    name:{type:String,required:true},
    comment:{type:String,required:true}
})

module.exports= mongoose.model('Comments',comments);