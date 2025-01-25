const {spawn} = require('child_process');
const app = require('express')();

let serverProcess = null;

function startServer(){
  console.log('Starting server logic...');
  serverProcess = spawn('node', ['server.js'], { stdio: 'inherit' });

  serverProcess.on('close', (code) => {
    console.log(`Child process exited with code ${code}`);
    serverProcess = null;
  });
}

// Start the server initially
startServer();


app.get('/restart', (req, res) => {
  console.log('Restarting server...');
  if (serverProcess) {
    serverProcess.kill('SIGTERM');
  }
  startServer();
  res.send('Server restarted!');
});

app.listen(3000, () => console.log(`startmanager.js up`));
