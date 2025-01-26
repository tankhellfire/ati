const path=require("path");
const fs=require('fs')


fs.readFileSync(path.join(__dirname, 'server.json'),'utf8')


const express=require('express');
const WebSocket=require('ws');
global.fetch = require('node-fetch');

const nacl=require('tweetnacl')


const disV=10
const app=express()

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/restart",(req,res)=>{
  res.send('restarting')
  process.exit()
})

app.post("/interactions",(req,res)=>{
  console.log('/interactions',req.body.type)
  // console.log('path:',req.path);
  // console.log('Headers:',Object.keys(req.headers));
  // console.log('Body:',req.body);
  

  if(!verifySignature(
    req.headers['x-signature-ed25519'],
    req.headers['x-signature-timestamp'],
    JSON.stringify(req.body)
  )){
    console.error('Signature verification failed');
    return res.status(401).send('Invalid signature');
  }
  if(req.body.type===1){return res.json({type:1})};
  if(req.body.type===2)return handelCommand(req,res,req.body.data.name)
    
  console.log('unknown post:',req.body.type)
});  

const server=app.listen(3000,e=>console.log(`up`));


function handelCommand(req,res,name){
  if(name==="ping"){
    return res.json({
      type: 4,
      data: {
        content: 'Pong!... hopefuly',
      },
    });
  }
  if(name==="setchannel"){
    return res.json({
      type: 4,
      data: {
        content: 'Pong!... hopefuly',
        flags: 0b1000000
      },
    });
  }

  return console.log('unknown command:',name)
}

registerCommands([
  {
    name: 'ping',
    description: 'Replies with Pong!... hopefuly',
    type: 1,
  },
  {
    name: 'setchannel',
    description: 'sets the current channel as the channel for 唱える',
    default_member_permissions: 0b1000,
    type: 1,
  }
])


const ws = new WebSocket(`wss://gateway.discord.gg/?v=${disV}&encoding=json`);

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
}

ws.on('message',async msg=>{
  let req=JSON.parse(msg)
  console.log('/ws',req.t,req.op)
  
  if(req.op===10){
    console.log(`hello msg set heartbeat to ${req.d.heartbeat_interval/1000}s`)
    setInterval(() => {
      ws.send(JSON.stringify({ op: 1, d: null })); // Heartbeat (op 1)
      console.log('heartbeat sent');
    },req.d.heartbeat_interval);
    return
  }
  
  if(req.t==='MESSAGE_CREATE'){
    await reactToMsg(req.d.channel_id,req.d.id,'maru:1332527322909245580')
    await sleep(500)
    await reactToMsg(req.d.channel_id,req.d.id,'batsu:1332527544234278995')
    return
  }
  
  console.log('unknown ws:',req.t)
});
ws.on('close',async(e)=>{console.warn('ws close',e)});
ws.on('error',async(e)=>{console.warn('ws error',e)});


function verifySignature(signature, timestamp, body) {
  const data = timestamp + body;
  const key = Buffer.from(process.env.DISCORD_PUBLIC_KEY, 'hex');
  const signedData = Buffer.from(signature, 'hex');

  return nacl.sign.detached.verify(Buffer.from(data), signedData, key);
}

async function reactToMsg(channelId,messageId,emoji){
  const response=await fetch(`https://discord.com/api/v${disV}/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(emoji)}/@me`,{
    method:'PUT',
    headers:{
      'Authorization':`Bot ${process.env.DISCORD_BOT_TOKEN}`,
      'Content-Type':'application/json'
    }
  })

  if(!response.ok){
    console.error('reactToMsg',response)
  }
}

async function registerCommands(commands) {

  const endpoint = `https://discord.com/api/v${disV}/applications/${process.env.id}/commands`;

  const response = await fetch(endpoint, {
    method: 'PUT', // Overwrites existing commands
    headers: {
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
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
