const express = require('express');
const router =express.Router();
const {signUp,loginUser ,deleteUser}=require("../controler/user");
const checkAuth=require("../middleware/check-auth");

// router.get('/',getAllposts)

// router.get('/:postId',getOnepost)

router.post('/signup',signUp);
router.post('/login',loginUser);

router.delete('/delete/:userId',checkAuth,deleteUser);

// router.put('/:postId',updatePost)


module.exports=router;
