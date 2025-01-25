(async()=>{
  //const WebSocket = require('ws');
  const app = require('express')();
  //const path = require("path");
  //const fs = require("fs");
  
  global.fetch=require('node-fetch')

  app.post("/*",(req,res)=>{
    //res.setHeader("Access-Control-Allow-Origin", "*")
    console.log(req)
  });  
  
  
  const server = app.listen(3000,e=>console.log(`up`));
  
})()
