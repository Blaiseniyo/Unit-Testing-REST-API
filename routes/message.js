const express = require('express');
const router =express.Router();
const {getAllmessages,getOnemessage,createNewmessage,deleteMessage,updateMessage}=require("../controler/message");
const checkAuth=require("../middleware/check-auth");

router.get('/',checkAuth,getAllmessages)

router.get('/:messageId',checkAuth,getOnemessage)

router.post('/',createNewmessage)

router.delete('/:messageId',checkAuth,deleteMessage)

router.put('/:messageId',checkAuth,updateMessage)


module.exports=router;