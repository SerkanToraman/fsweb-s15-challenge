// değişiklik yapmayın
const router = require('express').Router();
//const bilmeceler = require('./bilmeceler-data');
const bilmecelerModel=require('./bilmeceler-model')

router.get('/', async (req,res,next) => {
  try {
  const allBilmeceler = await bilmecelerModel.get();
  res.status(200).json(allBilmeceler);   
  } catch (error) {
    next(error)
  }
});

module.exports = router;
