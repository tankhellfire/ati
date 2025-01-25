(async()=>{
  //const WebSocket=require('ws');
  const express=require('express');
  const app=express()
  //const path=require("path");
  //const fs=require("fs");
  
  
  app.use(express.json());
  app.use(express.urlencoded({extended:true}));
  
  global.fetch=require('node-fetch')

  app.post("/*",async(req,res)=>{
    console.log('path:',req.path);
    console.log('Headers:',req.headers);
    console.log('Body:',req.body);
    
    res.send({ message: 'Received' });
  });  
  
  
  const server=app.listen(3000,e=>console.log(`up`));
  
})()
