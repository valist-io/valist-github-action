const { spawn } = require('child_process');
const cpCmd = spawn('chmod', ['+x', './bin/valist'], { shell: true });
cpCmd.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

cpCmd.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

const cmd = spawn('./bin/valist', { shell: true });
cmd.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

cmd.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

cmd.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});