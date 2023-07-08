const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET,HASHCOUNT} =require('../../config')

const authModel = require('./auth-model')

const mwCheckUsernamePasswordRolenameValid = async (req,res,next) => {
  try {
    let {username,password,rolename}=req.body;
      if(username){
        username = username.trim();
        let isUserExist = await authModel.getByUsername(username);
        if(isUserExist){
          res.status(401).json({message:"Username has already registered"})
        }else if(username.length>32){
          res.status(422).json({message:"Username cannot be longer than 32 letters"})
        }else{
          req.username=username;
        }
      }else{
        res.status(400).json({messsage:"Please enter a user name"}); 
      }

      if(password){
        password=password.trim();
        if(password.length<8){
          res.status(422).json({message:"Password cannot be shorter than 8 Characters"})
        }else{
          req.password=password;
        }
      }else{
        res.status(400).json({messsage:"Please enter a valid password"}); 
      }
      if(rolename){
        rolename=rolename.trim();
        if(rolename==="admin"){
          res.status(422).json({message:"Rolename cannot be admin"})
        }else if(rolename.length>32){
          res.status(422).json({message:"Rolename cannot be longer than 32 Characters"})
        }else{
          req.rolename=rolename;
          next();
        }
      }else{
          req.rolename ="user"
          next();
      }

  } catch (error) {
    next(error);
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
  mwCheckUsernamePasswordRolenameValid,
  mwUserNameVarmiLogin,
  mwCheckPayload
}