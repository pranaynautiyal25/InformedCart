const express=require('express');
require('dotenv').config();


const app=express();
const port=process.env.port||5000;

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})
