import * as core from '@actions/core';
import * as glob from '@actions/glob';
import * as fs from 'fs';
import { ethers } from 'ethers';
import { createClient, ReleaseMeta } from '../../valist-meta/valist-js/packages/valist-sdk/dist';

async function run(): Promise<void> {
	try {
		const accountName = core.getInput('account', { required: true });
		const projectName = core.getInput('project', { required: true });
		const releaseName = core.getInput('release', { required: true });
		const privateKey = core.getInput('private-key', { required: true });
		const files = core.getInput('files', { required: true });
		const followSymbolicLinks = core.getBooleanInput('follow-symbolic-links');

		const provider = new ethers.providers.JsonRpcProvider('https://rpc.valist.io');
		const signer = new ethers.Wallet(privateKey, provider);
		const valist = createClient(provider, signer);

		core.info('uploading files...');
		const metaURI = await valist.writeFolder(globFiles(files, followSymbolicLinks));
		core.info(`release URI ${metaURI}`);
		
		const release = new ReleaseMeta();
		release.name = releaseName;
		release.external_url = metaURI;
		release.image = core.getInput('image');
		release.description = core.getInput('description');

		core.info('publishing release...');
		const tx = await valist.createRelease(accountName, projectName, releaseName, release);
		core.info(`transaction hash ${tx.hash}`);
		tx.wait();
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