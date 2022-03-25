import * as glob from '@actions/glob';
import * as fs from 'fs';

export async function * globFiles(patterns: string, followSymbolicLinks: boolean) {
	const cwd = process.cwd();
	const globber = await glob.create(patterns, { followSymbolicLinks });

	for await (const source of globber.globGenerator()) {
		const path = source.replace(cwd, '').replace(/\\/g, '/');
	    const stat = await fs.promises.stat(source);
	    const content = stat.isFile() ? fs.createReadStream(source) : undefined;

	    yield {
	      path: path,
	      content: content,
	      mode: stat.mode,
	      mtime: stat.mtime,
	    }
	}
}
