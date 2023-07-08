const db = require('../../data/dbConfig.js')

const getById = id => {
  // KODLAR BURAYA
  return db("users as u")
            .leftJoin('roles as r','r.role_id','u.role_id')
            .select('u.id','u.username','u.password','r.rolename')
            .where('id',id).first();
}
const getByUsername = username => {
  // KODLAR BURAYA
  return db("users").where('username',username).first();
}

async function insertUser({username, password, rolename}){
  try {
    let created_user_id;
    await db.transaction(async trx => {
      let role_id_to_use;
      const[role] = await trx ('roles').where('rolename',rolename)
      if(role){
        role_id_to_use=role.role_id
      }else{
        const [role_id] = await trx("roles").insert({rolename:rolename})
        role_id_to_use = role_id
      }
      const [id] = await trx('users').insert({username,password,role_id:role_id_to_use})
      created_user_id =id
    })
    return getById(created_user_id);
    
  } catch (error) {
    console.log(error);
    next(error);
  }
 
} 

module.exports={
  getById,
  insertUser,
  getByUsername
}