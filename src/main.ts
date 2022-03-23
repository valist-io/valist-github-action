import * as core from '@actions/core';

try {
	const team = core.getInput('team', { required: true });
	const project = core.getInput('project', { required: true });
	const release = core.getInput('release', { required: true });
	const files = core.getMultilineInput('files', { required: true });  	
} catch (err) {
	core.setFailed(`Action failed with error ${err}`);
}
