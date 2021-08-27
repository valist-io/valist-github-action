const path = require('path');
const { spawn } = require('child_process');

const cmd = spawn(`bash -c ${path.join(__dirname, '/bin/valist')} publish --dryrun` , { shell: true });
cmd.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

cmd.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

cmd.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
