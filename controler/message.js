const  mongoose  = require('mongoose');
const Message = require('../models/message');


const getAllmessages=((req,res,next)=>{
    Message.find().exec().then((posts)=>{
        res.send(posts);
    }).catch(err =>{
        res.status(500).json({
            error:err
        })
    })
});


const getOnemessage =((req,res,next)=>{
    const id =req.params.messageId;

    Message.findById(id).exec().then(message=>{
        if(message){
            res.send({message})
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


// const createNewmessage= ((req,res,next)=>{
//     const message =new Message({
//        _id: new mongoose.Types.ObjectId(),
//         name: req.body.name,
//         email: req.body.email,
//         message:req.body.message
//     });
//     message.save().then(result =>{
//         console.log(result);
//         res.send(result);
//     }).catch(err=>{
//         res.status(500).send({
//             error:err
//         })
//     });
// });


const createNewmessage= async (req,res,next)=>{
    const message =new Message({
       _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        message:req.body.message
    });
    try{
        const result = await message.save();
        res.send(result)
    
    }catch(err){
        res.status(500).send({
            error:err
        })
    }
}

const deleteMessage =((req,res,next)=>{
    const id =req.params.messageId;
    Message.remove({_id:id}).exec().then(result=>{
        res.send(result);
    }).catch(err=>{
        res.status(500).json({
            error:err
        })
    })
});

const updateMessage =async(req,res,next)=>{
    const id =req.params.commentId;
    try{

        const result = await Message.update({_id:id},{$set:req.body})
        res.send(result)
    }
    catch(err){

        res.status(500).json({
            error:err
        })
    }
};

module.exports={
    getAllmessages,
    getOnemessage,
    createNewmessage,
    deleteMessage,
    updateMessage
}