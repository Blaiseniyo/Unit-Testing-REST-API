const express = require('express');
const router =express.Router();
const {getOnecomment,createNewcomment}=require("../controler/comment")


router.get('/:postId',getOnecomment)

router.post('/:postId',createNewcomment)


module.exports=router;
