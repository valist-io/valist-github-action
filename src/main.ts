import * as core from '@actions/core';
import * as fs from 'fs';
import { ethers } from 'ethers';
import globSource from 'ipfs-utils/src/files/glob-source.js';
import { 
  create,
  archiveSource,
  ReleaseMeta,
  InstallMeta,
  generateID
} from '@valist/sdk';

const Web3HttpProvider = require('web3-providers-http');

async function run(): Promise<void> {
  try {
    const accountName = core.getInput('account', { required: true });
    const projectName = core.getInput('project', { required: true });
    const releaseName = core.getInput('release', { required: true });
    const privateKey = core.getInput('private-key', { required: true });
    const path = core.getInput('path', { required: true });

    const image = core.getInput('image');
    const source = core.getInput('source');
    const hidden = core.getBooleanInput('include-dot-files');

    const rpcURL = core.getInput('rpc-url');
    const metaTx = core.getBooleanInput('meta-tx');

    const web3 = new Web3HttpProvider(rpcURL);
    const provider = new ethers.providers.Web3Provider(web3);

    const wallet = new ethers.Wallet(privateKey);
    const client = await create(provider, { wallet, metaTx });

    const { chainId } = await provider.getNetwork();
    const accountID = generateID(chainId, accountName);
    const projectID = generateID(accountID, projectName);
    const releaseID = generateID(projectID, releaseName);

    const isAccountMember = await client.isAccountMember(accountID, wallet.address);
    const isProjectMember = await client.isProjectMember(projectID, wallet.address);

    if (!isAccountMember || !isProjectMember) {
      core.error(`this key does not have access to ${accountName}/${projectName}`)
      throw new Error(`please add the ${wallet.address} address to the project settings at: https://app.valist.io/edit/project?account=${accountName}&project=${projectName}`);
    }

    const releaseExists = await client.releaseExists(releaseID);
    if (releaseExists) {
      throw new Error(`release ${releaseName} exists!`);
    }

    const install = new InstallMeta();
    install.name = core.getInput('install-name');
    install.darwin_amd64 = core.getInput('install-darwin-amd64');
    install.darwin_arm64 = core.getInput('install-darwin-arm64');
    install.linux_386 = core.getInput('install-linux-386');
    install.linux_amd64 = core.getInput('install-linux-amd64');
    install.linux_arm = core.getInput('install-linux-arm');
    install.linux_arm64 = core.getInput('install-linux-arm64');
    install.windows_386 = core.getInput('install-windows-386');
    install.windows_amd64 = core.getInput('install-windows-amd64');
    
    const release = new ReleaseMeta();
    release.name = releaseName;
    release.description = core.getInput('description');
    release.install = install;

    core.info('uploading files...');
    // upload release assets
    const stat = await fs.promises.stat(path);
    if (stat.isDirectory()) { 
      const artifact = globSource(path, '**/*', { hidden });
      release.external_url = await client.writeFolder(artifact);
    } else {
      const artifact = fs.createReadStream(path);
      release.external_url = await client.writeFile(artifact);
    }
    core.info(`successfully uploaded files to IPFS: ${release.external_url}`);

    // upload release image
    if (image) {
      const imageFile = fs.createReadStream(image);
      release.image = await client.writeFile(imageFile);
    }

    // upload source snapshot
    if (source) {
      const archiveURL = archiveSource(source);
      release.source = await client.writeFile(archiveURL);
    }

    core.info('publishing release...');
    const tx = await client.createRelease(projectID, releaseName, release);
    
    core.info(`transaction hash ${tx.hash}`);
    await tx.wait();
  } catch (err: any) {
    core.setFailed(`${err}`);
  }
}

run();