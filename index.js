const core = require('@actions/core');
const path = require('path');
const { spawn } = require('child_process');

const options = {
	shell: true,
	cwd: core.getInput('working-directory'),
};

// Matches
// Git-commit c482d11eaa9f4bb945cb586a5bef0647e0830fe7 
// SHA256 1850b9e58ae31365b1ef0bc72c1d71eed6fbf5330350cb65eb825c3356274448
// CIDv1 bafybeiaznetvic2b5u7h2xqcaewoouuydjabdzllp3ndac7dnysrwqjab4
const cmd = spawn(`bash -c "${path.join(__dirname, '/bin/valist')} publish"`, options);

cmd.stdout.on('data', (data) => process.stdout.write(`${data}`));
cmd.stderr.on('data', (data) => process.stdout.write(`${data}`));

cmd.on('close', (code) => code !== 0 && console.log(`child process exited with code ${code}`));
