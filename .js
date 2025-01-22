const ws = new WebSocket("https://spot-brook-hall.glitch.me");

ws.onopen=async()=>{
  ws.send("hi")
  console.log("Connected to the server");
  
  ws.onmessage=req=>{
    console.log("WebSocket onmessage",req)
  };

  ws.onerror=console.error
  ws.onclose=console.warn
};