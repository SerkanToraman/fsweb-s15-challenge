const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET,HASHCOUNT} =require('../../config')

const authModel = require('./auth-model')

const mwCheckUsernamePasswordExist = async (req,res,next) => {
  try {
    let {username,password}=req.body;
      if(username){
        username = username.trim();
        let isUserExist = await authModel.getByUsername(username);
        if(isUserExist){
          res.status(401).json({message:"Username has already registered"})
        }else if(username.length>32){
          res.status(422).json({message:"Username cannot be longer than 32 letters"})
        }else{
          req.body.username=username;
        }
      }else{
        res.status(400).json({messsage:"Please enter a user name"}); 
      }

      if(password){
        password=password.trim();
        if(password.length<8){
          res.status(422).json({message:"Password cannot be shorter than 8 Characters"})
        }else{
          req.body.password=password;
          next()
        }
      }else{
        res.status(400).json({messsage:"Please enter a valid password"}); 
      }

  } catch (error) {
    next();
  }
}

const mwUserNameVarmiLogin = async (req,res,next) =>{
  
  try {
    const {username,password}=req.body;
    const userIsExist = await authModel.getByUsername(username);
    if(userIsExist){
      if(bcrypt.compareSync(password,userIsExist.password)){
        req.userData = userIsExist;
        next();
      }else{
        res.status(401).json({message:'Invalid Password'})
      }
    }else{
      res.status(401).json({
        message: "Invalid Username"
      });
    }
  } catch (error) {
    next(error)
  }
}

const mwCheckPayload = async (req,res,next) =>{
  
  try {
    const {username,password}=req.body;
    if(username&&password){
      next()
    }else{
      res.status(401).json({
        message: "Please Enter Valid UserName & Password"
      });
    }
  } catch (error) {
    next(error)
  }
}
  

module.exports = {
  mwCheckUsernamePasswordExist,
  mwUserNameVarmiLogin,
  mwCheckPayload
}