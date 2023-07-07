const db = require('../../data/dbConfig.js')

function get(){
  // KODLAR BURAYA
  return db("bilmeceler");
}

module.exports ={
  get,
}