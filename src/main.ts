import * as core from '@actions/core';
import * as glob from '@actions/glob';
import { ethers } from 'ethers';
import { createClient, ReleaseMeta } from '../../valist-meta/valist-js/packages/valist-sdk/dist';

async function run(): Promise<void> {
	try {
		const teamName = core.getInput('team', { required: true });
		const projectName = core.getInput('project', { required: true });
		const releaseName = core.getInput('release', { required: true });
		const files = core.getInput('files', { required: true });
		const privateKey = core.getInput('private-key', { required: true });

		const provider = new ethers.providers.JsonRpcProvider('https://rpc.valist.io');
		//const wallet = new ethers.Wallet(privateKey); TODO
		const valist = createClient(provider);

		const followSymbolicLinks = core.getBooleanInput('follow-symbolic-links');
		const globber = await glob.create(files, { followSymbolicLinks });
		const metaURI = await valist.writeFolder(globber.globGenerator());
		
		const release = new ReleaseMeta();
		release.name = releaseName;
		release.external_url = metaURI;
		release.image = core.getInput('image');
		release.description = core.getInput('description');

		const tx = await valist.createRelease(teamName, projectName, releaseName, release);
		tx.wait();
	} catch (err: any) {
		core.setFailed(err.message);
	}
}

run();