const path = require('path');
const { spawn } = require('child_process');

const ls = spawn('ls ' + __dirname + '/bin', { shell: true });
ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

const chmod = spawn('chmod +x ' + path.join(__dirname, '/bin/valist'), { shell: true });
chmod.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

chmod.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

chmod.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

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