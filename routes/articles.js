const express = require('express');
const router =express.Router();
const {getAllposts,getOnepost,createNewpost,deletePost,updatePost}=require("../controler/article");
const checkAuth=require("../middleware/check-auth");
const multer=require("multer");

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
  };
  
const storage =multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
      }
    
});
const upload =multer({storage:storage});

router.get('/',getAllposts)

router.get('/:postId',getOnepost)

router.post('/',checkAuth,upload.single("coverImage"),createNewpost);

router.delete('/:postId',checkAuth,deletePost)

router.put('/:postId',checkAuth,updatePost)


module.exports=router;
