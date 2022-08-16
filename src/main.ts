import * as core from '@actions/core';
import { ethers } from 'ethers';
import { 
  create,
  // archiveSource,
  ReleaseMeta,
  InstallMeta,
  generateID,
  getFilesFromPath
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
    // const source = core.getInput('source');
    // const hidden = core.getBooleanInput('include-dot-files');

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

    if (!(isAccountMember || isProjectMember)) {
      core.error(`this key does not have access to ${accountName}/${projectName}`)
      throw new Error(`please add the ${wallet.address} address to the project settings at: https://app.valist.io/-/account/${accountName}/project/${projectName}/settings`);
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
    const artifacts = await getFilesFromPath(path);
    release.external_url = await client.writeFolder(artifacts);
    core.info(`successfully uploaded files to IPFS: ${release.external_url}`);

    // upload release image
    if (image) {
      const imageFile = await getFilesFromPath(image);
      release.image = await client.writeFile(imageFile[0]);
    }

    // upload source snapshot
    // if (source) {
    //   const archiveURL = archiveSource(source);
    //   release.source = await client.writeFile(archiveURL);
    // }

    core.info('publishing release...');
    const tx = await client.createRelease(projectID, releaseName, release);

    core.info(`transaction hash ${tx.hash}`);
    await tx.wait();

    core.info(`view the release at:
    https://app.valist.io/${accountName}/${projectName}/${releaseName}
    ${release.external_url}
    ipfs://${release.external_url.replace('https://gateway.valist.io/ipfs/', '')}
    `)
  } catch (err: any) {
    core.setFailed(`${err}`);
  }
}

run();