const path=require("path");
const fs=require('fs');
const express=require('express');
const WebSocket=require('ws');
const nacl=require('tweetnacl')
global.fetch = require('node-fetch');

const discordApiV=10

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

//path.join(__dirname, 'server.json')
//fs.readFileSync()

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
  
  ws.on('message',async msg=>{
    let req=JSON.parse(msg)
    //console.log(;
    if(req.t==='MESSAGE_CREATE'){
      await reactToMsg(req.d.channel_id,req.d.id,'maru:1332527322909245580')
      await sleep(500)
      await reactToMsg(req.d.channel_id,req.d.id,'batsu:1332527544234278995')
      return
    }
    console.log('unknown:',req.t)
  });
}



function verifySignature(signature, timestamp, body) {
  const data = timestamp + body;
  const key = Buffer.from(process.env.DISCORD_PUBLIC_KEY, 'hex');
  const signedData = Buffer.from(signature, 'hex');

  return nacl.sign.detached.verify(Buffer.from(data), signedData, key);
}

async function reactToMsg(channelId,messageId,emoji){
  const response=await fetch(`https://discord.com/api/v$/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(emoji)}/@me`,{
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

async function registerCommands(command) {

  const endpoint = `${DISCORD_API_BASE}/applications/${CLIENT_ID}/commands`;

  const response = await fetch(endpoint, {
    method: 'PUT', // Overwrites existing commands
    headers: {
      Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commands),
  });

  if (response.ok) {
    console.log('Commands registered successfully!');
  } else {
    const errorText = await response.text();
    console.error('Failed to register commands:', errorText);
  }
}

function sleep(ms){
  return new Promise(e=>setTimeout(e,ms))
}
