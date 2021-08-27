const path = require('path');
const { spawn } = require('child_process');

// Matches
// Git-commit 1838916563507ca86405061734ca03840fcfee8c 
// SHA256 a5b1b7312daf0725eac0df2aa08cfa46ac333117f09b376625e43e20e6dd81f7
// CIDv1 bafybeifrh4cvvrkpyhwsueifw4rapnm7xqn6jyckk4wwy2ot3mifczdzwm
const cmd = spawn(`bash -c "${path.join(__dirname, '/bin/valist')} publish --dryrun"`, { shell: true });

cmd.stdout.on('data', (data) => process.stdout.write(`${data}`));
cmd.stderr.on('data', (data) => process.stdout.write(`${data}`));

cmd.on('close', (code) => code !== 0 && console.log(`child process exited with code ${code}`));
