const request = require('supertest');
const server = require('../api/server');
const db = require('../data/dbConfig');
//const bcrypt = require("bcryptjs");


// afterAll(async () => {
//   await db.destroy()
// })

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
  await db.seed.run();
})

// testleri buraya yazın
test('Testler çalışır durumda]', () => {
  expect(true).toBe(true)
})

test('sanity check', () => {
  expect(process.env.NODE_ENV).toBe('testing')
})

describe('USERS REGISTER',()=>{
  test('[1] Register User',async() =>{
    // ARRANGE
    const newUser = {
      username:"Serkan",
      password:"123456789"
    }
    // ACT
    const res = await request(server).post('/api/auth/register').send(newUser);
    //ASSERT
    expect(res.body).toHaveProperty('username',"Serkan");
  })
  test('[2] cannot register if Username exists',async() =>{
    // ARRANGE
    const newUser = {
      username:"Serkan",
      password:"123456789"
    }
    // ACT
    const res = await request(server).post('/api/auth/register').send(newUser);
    //ASSERT
    expect(res.body).toHaveProperty('message',"Username has already registered");
  })
  test('[3] cannot register if Password is not Valid',async() =>{
    // ARRANGE
    const newUser = {
      username:"Mehmet",
      password:"1239"
    }
    // ACT
    const res = await request(server).post('/api/auth/register').send(newUser);
    //ASSERT
    expect(res.body).toHaveProperty('message',"Password cannot be shorter than 8 Characters");
  })
})

describe('USERS LOGIN',()=>{
  test('[4] User Login', async()=>{
    //ARRANGE
    const existingUser={
        username:"Mine",
        password:"123456789" 
    }
    //ACT
    const res = await request(server).post('/api/auth/login').send(existingUser);
    //ASSERT
    expect(res.body).toHaveProperty('message',"Welcome, Mine");
  })
  test('[5] Invalid USER', async()=>{
    //ARRANGE
    const existingUser={
        username:"",
        password:"123456789" 
    }
    //ACT
    const res = await request(server).post('/api/auth/login').send(existingUser);
    //ASSERT
    expect(res.body).toHaveProperty('message','Please Enter Valid UserName & Password');
  })
})

describe('BİLMECELER',()=>{
  test('[6] Valid user can see bilmeceler',async()=>{
    //ARRANGE
    const existingUser={
      username:"Mine",
      password:"123456789" 
  }
    //ACT
    const userLoginRes = await request(server).post('/api/auth/login').send(existingUser);
    const res = await request(server).get("/api/bilmeceler").set('authorization',userLoginRes.body.token);
    //Assert
    expect(res.body).toHaveLength(3);

  })
  test('[7] Invalid User can see bilmeceler',async()=>{
    const res = await request(server).get("/api/bilmeceler").set('authorization',"");
    //Assert
    expect(res.body).toHaveProperty('message','Token gereklidir');

  })

})