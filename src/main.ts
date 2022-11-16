import * as core from '@actions/core';
import { ethers } from 'ethers';
import {
  create,
  generateID,
  ReleaseConfig,
} from '@valist/sdk';

const Web3HttpProvider = require('web3-providers-http');

async function run(): Promise<void> {
  try {
    const accountName = core.getInput('account', { required: true });
    const projectName = core.getInput('project', { required: true });
    const releaseName = core.getInput('release', { required: true });
    const privateKey = core.getInput('private-key', { required: true });

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
      const message = `release ${releaseName} exists! skipping publish.`;
      core.warning(message);
      console.warn(message);
      return;
    }

    let config = new ReleaseConfig(accountName, projectName, releaseName);

    config.image = core.getInput('image');
    config.description = core.getInput('description');

    config.platforms.web = core.getInput('platform-web');
    config.platforms.darwin_amd64 = core.getInput('platform-darwin-amd64');
    config.platforms.darwin_arm64 = core.getInput('platform-darwin-arm64');
    config.platforms.linux_amd64 = core.getInput('platform-linux-amd64');
    config.platforms.linux_arm64 = core.getInput('platform-linux-arm64');
    config.platforms.windows_amd64 = core.getInput('platform-windows-amd64');
    config.platforms.android_arm64 = core.getInput('platform-android-arm64');

    core.info('uploading files...');

    const release = await client.uploadRelease(config);

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