(async()=>{
  const WebSocket = require('ws');
  const app = require('express')();
  const path = require("path");
  const fs = require("fs");
  
  global.fetch=require('node-fetch')
  global.lib=await Object.getPrototypeOf(async()=>{}).constructor('exports',await(await fetch('https://tankhellfire.glitch.me/lib/lib.js')).text()+';\nreturn exports')({})

  app.get("/*",(req,res)=>{
    res.setHeader("Access-Control-Allow-Origin", "*")
  });  
  
  
  const server = app.listen(3000,e=>console.log(`up`));
  
  const wss = new WebSocket.Server({ server });
  let id=0
  wss.on('connection',(ws,req)=>{
    
    ws.id = id++;
    console.log('A new client connected!',ws.id,'@',req.url);

    ws.on('message',msg=>{
      console.log(`Received:'${msg}' from ${ws.id}`);
      
      wss.clients.forEach((client)=>{
        if (client.readyState === WebSocket.OPEN && client.id != ws.id) {
          client.send(msg);
        }
      });
    });
    
    ws.onerror=console.error
    ws.onclose=console.log
    
    ws.send('connected');
  });
  
  
})()
