const express=require('express');
const WebSocket=require('ws');
const nacl=require('tweetnacl')
global.fetch = require('node-fetch');

const app=express()

app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.post("/interactions",(req,res)=>{
  console.log('path:',req.path);
  console.log('Headers:',Object.keys(req.headers));
  console.log('Body:',req.body);
  

  if(!verifySignature(
    req.headers['x-signature-ed25519'],
    req.headers['x-signature-timestamp'],
    JSON.stringify(req.body)
  )){
    console.error('Signature verification failed');
    return res.status(401).send('Invalid signature');
  }

  if(req.body.type===1){
    console.log('pong')
    return res.json({type:1});
  }
});  

app.post("/*",(req,res)=>{
  console.log('path:',req.path);
  console.log('Headers:',Object.keys(req.headers));
  console.log('Body:',req.body);
});  

const server=app.listen(3000,e=>console.log(`up`));


const ws = new WebSocket("wss://gateway.discord.gg/?v=10&encoding=json");

ws.onopen=e=>{
  console.log('Connected to Discord Gateway');

  ws.send(JSON.stringify({
    op: 2, // Identify opcode
    d: {
      token: process.env.DISCORD_BOT_TOKEN,
      intents: 53608447, // Intents for message events (e.g., GUILDS + GUILD_MESSAGES)
      properties: {
        $os: 'linux',
        $browser: 'chrome',
        $device: 'discord.js'
      }
    }
  }));
  
  ws.on('message',msg=>{
    let req=JSON.parse(msg)
    //console.log(;
    if(req.t==='MESSAGE_CREATE'){
      console.log(req)
      reactToMsg(req.d.channel_id,req.d.id,'😄')
      return
    }
    console.log('unknown:',req.t)
  });
}


async function reactToMsg(channelId,messageId,emoji){
  const response=await fetch(`https://discord.com/api/v9/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(emoji)}/@me`,{
    method:'PUT',
    headers:{
      'Authorization':`Bot ${process.env.DISCORD_BOT_TOKEN}`,
      'Content-Type':'application/json'
    }
  })

  if(!response.ok){
    console.error(response)
  }
    
}



function verifySignature(signature, timestamp, body) {
  const data = timestamp + body;
  const key = Buffer.from(process.env.DISCORD_PUBLIC_KEY, 'hex');
  const signedData = Buffer.from(signature, 'hex');

  return nacl.sign.detached.verify(Buffer.from(data), signedData, key);
}
