const express = require('express');
const route =express.Router();
const articleRoute =require("./articles");
const commentRoute =require("./comments");
const messageRoute =require("./message");
const userRoute=require("./user");
route.use("/articles",articleRoute);
route.use("/comment",commentRoute);
route.use("/message",messageRoute);
route.use("/user",userRoute);


module.exports=route;


