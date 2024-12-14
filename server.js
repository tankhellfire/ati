const WebSocket = require('ws');
const express = require('express');
const path = require("path");
const fs = require("fs");

const app = express();

app.get('/', (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*").sendFile('/app/index.html');
});

app.get("/*", (req, res) => {
  function readDir(requestedPath){
              fs.readdir(requestedPath, (err, files) => {
            if (err) {
              res.status(500).send(`Error reading directory"${err}"`);
              return
            }

            // Return the list of files
            res.send(`<body
    style="
      margin: 0;
      height: 100vh;
      width: 100vw;
      background-color: #000;
      color: #fff;
      font-family: Consolas, monospace;
    ">${files.map((file) =>`<a href="${req.path}">${file}</a>`).join("<br>")}`);
          });
  }
  
  
  let dirPath=req.path.split('/')
  if(dirPath.pop()==="index"){
    return readDir(path.join(__dirname,...dirPath))
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
          return readDir(requestedPath)
        } else {
          return res.sendFile(indexPath);
        }
      });
    } else {
      // If it's not a directory, serve the file
      res.sendFile(requestedPath);
    }
  });
});

const server = app.listen(3000, () => {
  console.log(`up`);
});