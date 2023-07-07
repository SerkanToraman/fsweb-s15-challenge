const db = require('../../data/dbConfig.js')

const getById = id => {
  // KODLAR BURAYA
  return db("users").where('id',id).first();
}
const getByUsername = username => {
  // KODLAR BURAYA
  return db("users").where('username',username).first();
}

async function insertUser(account){
  const [id] = await db("users").insert(account)
  return getById(id);
} 

module.exports={
  getById,
  insertUser,
  getByUsername
}