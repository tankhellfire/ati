const ws = new WebSocket("https://spot-brook-hall.glitch.me");

ws.onopen = async()=>{
  ws.send("hi")
  console.log("Connected to the server");
  
  ws.onmessage=async(req)=>{
    console.log("WebSocket onmessage",req)
  };


  
  ws.onerror = async(err)=>{
    console.error("WebSocket onerror", err);
  };  
  ws.onclose = async(err)=>{
    console.warn("WebSocket onclose",err);
  };
};