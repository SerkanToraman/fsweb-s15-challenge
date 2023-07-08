const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const {JWT_SECRET,HASHCOUNT} =require('../../config')

const {mwUserNameVarmiLogin,mwCheckUsernamePasswordRolenameValid,mwCheckPayload} = require('./auth-middleware')
const authModel = require('./auth-model')

router.post('/register', mwCheckUsernamePasswordRolenameValid,async (req, res,next) => {
  //res.end('kayıt olmayı ekleyin, lütfen!');
  /*
    EKLEYİN
    Uçnoktanın işlevselliğine yardımcı olmak için middlewarelar yazabilirsiniz.
    2^8 HASH TURUNU AŞMAYIN!

    1- Yeni bir hesap kaydetmek için istemci "kullanıcı adı" ve "şifre" sağlamalıdır:
      {
        "username": "Captain Marvel", // `users` tablosunda var olmalıdır
        "password": "foobar"          // kaydedilmeden hashlenmelidir
      }

    2- BAŞARILI kayıtta,
      response body `id`, `username` ve `password` içermelidir:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- Request bodyde `username` ya da `password` yoksa BAŞARISIZ kayıtta,
      response body şunu içermelidir: "username ve şifre gereklidir".

    4- Kullanıcı adı alınmışsa BAŞARISIZ kayıtta,
      şu mesajı içermelidir: "username alınmış".
  */

  try {
    const insertedUserData ={
      username : req.username,
      password : req.password,
      rolename : req.rolename,
    }
    insertedUserData.password = bcrypt.hashSync(insertedUserData.password,HASHCOUNT)
    const insertedUser = await authModel.insertUser(insertedUserData)
    res.status(201).json(insertedUser)
  } catch (error) {
    next();
  }
});

router.post('/login',mwCheckPayload,mwUserNameVarmiLogin, (req, res) => {
  //res.end('girişi ekleyin, lütfen!');
  /*
    EKLEYİN
    Uçnoktanın işlevselliğine yardımcı olmak için middlewarelar yazabilirsiniz.

    1- Var olan bir kullanıcı giriş yapabilmek için bir `username` ve `password` sağlamalıdır:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- BAŞARILI girişte,
      response body `message` ve `token` içermelidir:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- req body de `username` ya da `password` yoksa BAŞARISIZ giriş,
      şu mesajı içermelidir: "username ve password gereklidir".

    4- "username" db de yoksa ya da "password" yanlışsa BAŞARISIZ giriş,
      şu mesajı içermelidir: "geçersiz kriterler".
  */
      try {
        const payload ={
          username : req.userData.username,
          password : req.userData.password,
          role_name: req.body.role_name,
        }
        const token = jwt.sign(payload,JWT_SECRET,{expiresIn:"24h"});
        res.json({message: `Welcome, ${req.userData.username}`,
        token:token}) 
      } catch (error) {
        next();
      }    
});


module.exports = router;
