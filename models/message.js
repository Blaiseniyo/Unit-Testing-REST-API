const mongoose = require('mongoose');

const messages = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{type:String,required:true},
    email:{type:String,required:true},
    message:{type:String,required:true}
});
 
module.exports= mongoose.model('Messages',messages);