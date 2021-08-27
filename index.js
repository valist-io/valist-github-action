const path = require('path');
const { spawn } = require('child_process');

const cmd = spawn(`bash -c "${path.join(__dirname, '/bin/valist')} publish --dryrun"`, { shell: true });

cmd.stdout.on('data', (data) => console.log(`${data}`));
cmd.stderr.on('data', (data) => console.log(`${data}`));

cmd.on('close', (code) => code !== 0 && console.log(`child process exited with code ${code}`));
