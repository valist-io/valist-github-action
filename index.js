const path = require('path');
const { spawn } = require('child_process');

const valist = require('@valist/cli');

async function fetchArtifact() {
  const fetchCmd = spawn(`node ${path.join(__dirname, 'node_modules/@valist/cli/dist/index.js')}`, { shell: true });
  fetchCmd.stdout.on('data', (data) => process.stdout.write(`${data}`));
  fetchCmd.stderr.on('data', (data) => process.stdout.write(`${data}`));

  return new Promise((resolve, reject) => {
    fetchCmd.on('close', resolve);
    fetchCmd.on('error', reject);
  });
}

async function markExecutable() {
  const cmd = spawn(`chmod +x  ${path.join(__dirname, 'node_modules/@valist/cli/bin/valist')}`, { shell: true });
  cmd.stdout.on('data', (data) => process.stdout.write(`${data}`));
  cmd.stderr.on('data', (data) => process.stdout.write(`${data}`));
  return new Promise((resolve, reject) => {
    cmd.on('close', resolve);
    cmd.on('error', reject);
  });
}

function publish() {
  const cmd = spawn(`bash -c "${path.join(__dirname, 'node_modules/@valist/cli/bin/valist')} publish --dryrun"`, { shell: true });
  cmd.stdout.on('data', (data) => process.stdout.write(`${data}`));
  cmd.stderr.on('data', (data) => process.stdout.write(`${data}`));
  cmd.on('close', (code) => code !== 0 && console.log(`child process exited with code ${code}`));
}

(async() => {
  await fetchArtifact()
  await markExecutable()
  publish()
})();