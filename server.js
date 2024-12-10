const WebSocket = require('ws');
const express = require('express');
const fs = require("fs");

const app = express();

app.get('/', (req, res) => {
  res.sendFile('/app/index.html');
});
app.get('/*', (req, res) => {
  res.sendFile('/app'+req.url)
});

const server = app.listen(3000, () => {
  console.log(`up`);
});