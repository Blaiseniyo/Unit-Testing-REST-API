const  mongoose  = require('mongoose');
const User = require('../models/user');
const bcrypt=require("bcrypt");
const jwt =require("jsonwebtoken");
require("dotenv").config();


const signUp=((req,res,nex)=>{
    User.find({email:req.body.email})
    .exec()
    .then(user =>{
        if(user.length >=1){
            return res.status(409).json({
                message:"Mail exists"
            });
        
        }else{
            bcrypt.hash(req.body.password,saltRound=10)
            .then(hash=>{
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email:req.body.email,
                    password:hash
                });
                user.save().then(result=>{
                    res.status(201).send({
                        message:'user created'
                    });
                }).catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error:err
                    })
                })
            })
        }
    })
})


const loginUser=((req,res,next)=>{
    User.findOne({email:req.body.email}).exec()
    .then(user=>{
        bcrypt.compare(req.body.password,user.password,(err,result)=>{
            if(err){
                return res.status(401).json({
                    message:"auth failed"
                }) 
            }
            if(result){
                const token=jwt.sign({
                    email:user.email,
                    userId:user._id
                },process.env.jwt_key,
                {
                    expiresIn:'1h'
                })
                return res.status(200).json({
                    message:"auth successful",
                    _id:user._id,
                    token:token
                })
            }
            return res.status(401).json({
                message:"auth failed"
            })
        })
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
        error:{
            message:"Auth failed"
        }
        })
    })
})

const deleteUser=((req,res,next)=>{
    console.log("hello delete");
    const userId=req.params.userId;
    console.log(userId);
    User.remove({_id:userId}).exec().then(result=>{
        if(result.deletedCount==0){
            return res.status(500).send({
                message:'wrong Id provided',
            })
        }
        res.status(200).send({
            message:'user deleted',
            result:result
        })
    }).catch(err=>{
        res.status(500).json({
            error:err
        })
    })
})


module.exports= {
    signUp,
    loginUser,
    deleteUser
}