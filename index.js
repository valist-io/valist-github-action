const core = require('@actions/core');
const path = require('path');
const { spawn } = require('child_process');

const options = {
	shell: true,
	cwd: core.getInput('working-directory'),
};

// Matches
// Git-commit 43be018847b32288cc3c8fef982585919a56de44 
// SHA256 9183eee79b6a7711dad7a2946ee57b25d45fe3d84a3236fea1295da32e065da4
// CIDv1 bafybeicfvgamh3po4nh3grndyjcigop6afflmkgzcdk5fz3udjlzbadfz4
const cmd = spawn(`bash -c "${path.join(__dirname, '/bin/valist')} publish"`, options);

cmd.stdout.on('data', (data) => process.stdout.write(`${data}`));
cmd.stderr.on('data', (data) => process.stdout.write(`${data}`));

cmd.on('close', (code) => code !== 0 && console.log(`child process exited with code ${code}`));
