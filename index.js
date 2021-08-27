const path = require('path');
const { spawn } = require('child_process');

console.log("Current folder", __dirname);
const cmd = spawn('./' + path.join(__dirname, '/bin/valist'), { shell: true });
cmd.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

cmd.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

cmd.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});