import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

export async function recursivelyFindRelativePackageJsonFilePaths(startingDir: string): Promise<string[]> {
	let results = [];
	const list = await readdir(startingDir);
	for (const file of list) {
		const filePath = join(startingDir, file);
		const fileStat = await stat(filePath);
		if (fileStat.isDirectory()) {
			results = results.concat(await recursivelyFindRelativePackageJsonFilePaths(filePath));
		} else if (file === 'package.json') {
			results.push(filePath);
		}
	}
	return results;
}
