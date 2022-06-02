import * as core from '@actions/core';
import * as glob from '@actions/glob';
import * as fs from 'fs';
import { ethers } from 'ethers';
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
		const files = core.getInput('files', { required: true });

		const followSymbolicLinks = core.getBooleanInput('follow-symbolic-links');
		const image = core.getInput('image');
		const source = core.getInput('source');

		const rpcURL = core.getInput('rpc-url');
		const metaTx = core.getBooleanInput('meta-tx');

		const web3 = new Web3HttpProvider(rpcURL);
		const provider = new ethers.providers.Web3Provider(web3);

		const wallet = new ethers.Wallet(privateKey);
		const client = await create(provider, { wallet, metaTx });

		const { chainId } = await provider.getNetwork();
		const accountID = generateID(chainId, accountName);
		const projectID = generateID(accountID, projectName);

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
		// upload release assets
		release.external_url = await client.writeFolder(globFiles(files, followSymbolicLinks));
		core.info(`release ${release}`);

		core.info('publishing release...');
		const tx = await client.createRelease(projectID, releaseName, release);
		
		core.info(`transaction ${tx}`);
		await tx.wait();
	} catch (err: any) {
		core.setFailed(`${err}`);
	}
}

async function * globFiles(patterns: string, followSymbolicLinks: boolean) {
	const cwd = process.cwd();
	const globber = await glob.create(patterns, { followSymbolicLinks });

	for await (const source of globber.globGenerator()) {
		const path = source.replace(cwd, '').replace(/\\/g, '/');
		const stat = await fs.promises.stat(source);
		const content = stat.isFile() ? fs.createReadStream(source) : undefined;

	    // path or content must be defined
	    if (path === '' && content === undefined) continue;

	    yield {
	      path: path,
	      content: content,
	      mode: stat.mode,
	      mtime: stat.mtime,
	    }
	}
}

run();