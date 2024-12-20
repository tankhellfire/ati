(async()=>{
  const WebSocket = require('ws');
  const express = require('express');
  const path = require("path");
  const fs = require("fs");
  const fetch=global.fetch=require('node-fetch')
  
  const lib=await Object.getPrototypeOf(async()=>{}).constructor('exports',await((await(fetch('https://tankhellfire.glitch.me/lib/lib.js'))).text())+';\nreturn exports')({})

  
  console.log(lib)
  
  console.log(await(lib('spaceGame7/index.js')))

  const app = express();

  app.get('/', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*").sendFile('/app/index.html');
  }
  );
  
  app.get("/game", (req, res) => {
    
  })

  app.get("/*", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    function readDir(requestedPath, dirUrl) {
      fs.readdir(requestedPath, (err, files) => {
        if (err) {
          res.status(500).send(`Error reading directory"${err}"`);
          return
        }

        // Return the list of files
        res.send(`<body style="
          margin: 0;
          height: 100vh;
          width: 100vw;
          background-color: #000;
          color: #fff;
          font-family: Consolas, monospace;
         ">${
          files.map( (file) => `<a href="${dirUrl + '/' + file
         }">${file}</a>`).join("<br>")}<br><br><a href="..">..</a>`);
      }
      );
    }

    let dirPath = req.path.split('/')
    if (dirPath.pop() === "index") {
      return readDir(path.join(__dirname, ...dirPath), req.path.split('/').slice(0, -1).join('/'))
    }

    const requestedPath = path.join(__dirname, req.path);

    fs.stat(requestedPath, (err, stats) => {
      if (err) {
        //not a path
        res.status(404).sendFile(path.join(__dirname, "idk.html"));
        return
      }

      if (stats.isDirectory()) {
        const indexPath = path.join(requestedPath, "index.html");
        fs.access(indexPath, fs.constants.F_OK, (err) => {
          if (err) {
            return readDir(requestedPath, req.path)
          } else {
            return res.sendFile(indexPath);
          }
        }
        );
      } else {
        // If it's not a directory, serve the file
        res.sendFile(requestedPath);
      }
    }
    );
  }
  );

  const server = app.listen(3000, () => {
    console.log(`up`);
  }
  )
  
  
  
  
  
  const wss = new WebSocket.Server({ server });
  let id=0
  wss.on('connection',(ws)=>{
    console.log(ws)
    ws.id = id++;
    console.log('A new client connected!',ws.id);

    let info
    ws.on('message',(message)=>{
      if(info===undefined){
        info=1
      }
      console.log(`Received:'${message}' from ${ws.id}`);

      
      wss.clients.forEach((client)=>{
        if (client.readyState === WebSocket.OPEN && client.id != ws.id) {
          client.send(message);
        }
      });
      
    });
    
    ws.onerror=(err)=>{
      console.log(err.code,err.info)
    }
    ws.onclose=(msg)=>{
      console.log(msg.code,msg.info)
    }
    
    ws.send('connected');
  });
})()
