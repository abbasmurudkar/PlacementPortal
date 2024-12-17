import jwt from "jsonwebtoken";
import { SecretValues } from "../Key.js";
import mongoose from "mongoose";
import "../Schema/Users.js"
const User = mongoose.model("User");

export const requireLogin = (req,res,next) =>{
   const {authorization} = req.headers;
   console.log("authoration :"+authorization)
   if(!authorization){
    return res.status(401).json({error:"You must be logged in!"})
   }
   const token = authorization.replace("Bearer ","")
   console.log("token: "+token)
   jwt.verify(token,SecretValues,(err,payload)=>{
    console.log("payload: "+payload)
    if(err){
      return  res.status(401).json({error:"You must be logged in!"});
    }
    const {_id} =payload;
    User.findById(_id).then(userdata=>{
        req.user = userdata;
        console.log("userdata:"+userdata)
        console.log("userdata:"+req.user)
        next()
    }
  )}
)}