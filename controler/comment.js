const  mongoose  = require('mongoose');
const Comment = require('../models/comment');


const getOnecomment =((req,res,next)=>{
    const id =req.params.postId;
    Comment.find({postId:id}).exec().then(comment=>{
        if(comment.length > 0){
            res.send({comment})
        }else{
            res.status(404).json({
                message:'No valid Post for the provided ID'
            })
        }
    }).catch(err =>{
        res.status(500).json({
            error:err
        })
    })
});


const createNewcomment= ((req,res,next)=>{
    const comment =new Comment({
       _id: new mongoose.Types.ObjectId(),
        postId: req.params.postId,
        name: req.body.name,
        comment:req.body.comment
    });
    comment.save().then(result =>{
        console.log(result);
        res.send(result);
    }).catch(err=>{
        res.status(500).send({
            error:err
        })
    });
});



module.exports={
    getOnecomment,
    createNewcomment
}