import mongoose from "mongoose";
import express from "express";
import "../Schema/Users.js";
import "../Schema/Companyschema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SecretValues } from "../Key.js";

const routerAuth = express.Router();
const User = mongoose.model("User");


//For login
routerAuth.post("/", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please Fill Out The Whole Form" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (!savedUser) {
        return res.json({ error: "Invalid Email and Password" });
      }
      bcrypt
        .compare(password, savedUser.password)
        .then((doMatch) => {
          if (doMatch) {
            const token = jwt.sign({_id:savedUser._id},SecretValues)
            const {_id,email} = savedUser;
            console.log(_id)
            res.json({
              token,user:{
                _id,
                email,
                message: "SignedIn Successfully"
              }
            })
          } else {
            return res.status(422).json({ error: "Invalid Email or Password" });
          }
        })
        .catch((err) => {
          console.error(err);
          return res.status(500).json({ error: "Internal Server Error" });
        });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    });
});


  
    
export default routerAuth;
