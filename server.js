const express=require('express');
const nacl = require('tweetnacl')

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
    return res.json({type:1}); // Respond to ping with type 1
  }
});  


const server=app.listen(3000,e=>console.log(`up`));





function verifySignature(signature, timestamp, body) {
  const data = timestamp + body;
  const key = Buffer.from(process.env.DISCORD_PUBLIC_KEY, 'hex');
  const signedData = Buffer.from(signature, 'hex');

  return nacl.sign.detached.verify(Buffer.from(data), signedData, key);
}
