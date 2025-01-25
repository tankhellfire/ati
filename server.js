(async()=>{
  //const WebSocket=require('ws');
  const express=require('express');
  const app=express()
  //const path=require("path");
  //const fs=require("fs");
  
  
  app.use(express.json());
  app.use(express.urlencoded({extended:true}));
  
  global.fetch=require('node-fetch')

  app.post("/*",(req,res)=>{
    console.log('path:',req.path);
    console.log('Headers:',Object.keys(req.headers));
    console.log('Body:',req.body);
    
    if (req.body.type===1) {
      console.log('pong')
      return res.json({type:1}); // Respond to ping with type 1
    }
  });  
  
  
  const server=app.listen(3000,e=>console.log(`up`));
  
})()
