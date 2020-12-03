const  mongoose  = require('mongoose');
const Post = require('../models/post');


// const getAllposts=((req,res,next)=>{
//     Post.find().exec().then((result)=>{
//         res.send({posts:result});
//     }).catch(err =>{
//         res.status(500).json({
//             error:err
//         })
//     })
// });

const getAllposts= async (req,res,next)=>{
    try{
        const result= await Post.find({});
        // console.log(result)
        res.send(result);
    }catch(err){
        res.status(500).json({
            error:err
        })
    }
};

// const getOnepost =((req,res,next)=>{
//     const id =req.params.postId;

//     Post.findById(id).exec().then(post=>{
//         if(post){
//             res.send(post)
//         }else{
//             res.status(404).json({
//                 message:'No valid Post for the provided ID'
//             })
//         }
//     }).catch(err =>{
//         res.status(500).json({
//             error:err
//         })
//     })
// });


const getOnepost = async (req,res,next)=>{
    try{
        const id =req.params.postId;
        const post = await Post.findById(id);
        if(post){
            res.send(post);
        }else{
            res.status(404).json({
                message:'No valid Post for the provided ID'
            });
        }

    }catch(err){
        res.status(500).json({
            error:err
        })
        
    }
};

// const createNewpost= ((req,res,next)=>{
//     const post =new Post({
//        _id: new mongoose.Types.ObjectId(),
//         title: req.body.title,
//         body: req.body.body,
//         image:req.file.path
//     });
//     post.save().then(result =>{
//         res.send(result);
//     }).catch(err=>{
//         res.status(500).send(err);
//     });
// });

const createNewpost= async (req,res,next)=>{
    try{
        const post =new Post({
        _id: new mongoose.Types.ObjectId(),
            title: req.body.title,
            body: req.body.body,
            image:req.file.path
        });
        const result = await post.save();
        // console.log(result);
        res.send(result);
    }catch(err){
        // console.log(err);
        res.status(500).send(err);
    }
};

// const deletePost =((req,res,next)=>{
//     const id =req.params.postId;
//     Post.remove({_id:id}).exec().then(result=>{
//         res.send(result);
//     }).catch(err=>{
//         res.status(500).json(err)
//     })
// });

const deletePost =async (req,res,next)=>{
    try{
        const id =req.params.postId;
        const result = await Post.remove({_id:id});
        res.send(result);
    }catch(err){
        res.status(500).json(err)
    }
};

// const updatePost =((req,res,next)=>{
//     const id =req.params.postId;
//     Post.update({_id:id},{$set:req.body}).exec().then(result =>{
//         res.send(result)
//     }).catch(err=>{
//         res.send(err)
//     })
// });

const updatePost =async (req,res,next)=>{
    const id =req.params.postId;
    try{
        const result = await Post.update({_id:id},{$set:req.body})
            res.send(result)

    }catch(err){
        res.status(500).send(err)
    }
};

module.exports={
    getAllposts,
    getOnepost,
    createNewpost,
    deletePost,
    updatePost
}