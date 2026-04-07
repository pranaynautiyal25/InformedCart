const express =require('express');
const router=express.Router();

router.get('/extractEdibleProduct',(req,res)=>{
    res.send('extract route');
});

router.post('/login',(req,res)=>{
    res.send('login route');
});

module.exports=router;
