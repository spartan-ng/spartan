import { type Tree, formatFiles, readJsonFile, updateJson } from '@nx/devkit';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';

async function recursivelyFindRelativePackageJsonFilePaths(startingDir: string): Promise<string[]> {
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

const getSpartanDependencyKeys = (dependencies?: Record<string, string>): string[] =>
	Object.keys(dependencies ?? {}).filter((key) => key.startsWith('@spartan-ng'));

export const replaceSpartanVersions = (content: string, oldVersion: string, newVersion: string): string => {
	/**
	 * Regular expression to match SPARTAN-prefixed version constants:
	 * - `(SPARTAN_[A-Z_]+_VERSION\\s*=\\s*['"])`:
	 *   1. `SPARTAN_`: Matches the exact prefix for the constant.
	 *   2. `[A-Z_]+`: Matches any uppercase letters and underscores (e.g., ACCORDION_BRAIN).
	 *   3. `_VERSION`: Ensures the constant ends with `_VERSION`.
	 *   4. `\\s*`: Matches zero or more spaces around the `=` sign.
	 *   5. `['"]`: Captures the opening quote (single or double).
	 *   6. Encloses the entire match before the version in group 1 (`$1`).
	 * - `${oldVersion}`: Matches the exact old version string.
	 * - `(['"])`: Captures the closing quote in group 2 (`$2`).
	 * - `g` flag: Ensures the regex replaces all matches globally, not just the first occurrence.
	 */
	const spartanVersionRegex = new RegExp(`(SPARTAN_[A-Z_]+_VERSION\\s*=\\s*['"])${oldVersion}(['"])`, 'g');
	return content.replace(spartanVersionRegex, `$1${newVersion}$2`);
};

const replaceUiVersionInCliVersionsFile = (tree: Tree, oldVersion: string, newVersion: string) => {
	const filePath = `libs/cli/src/generators/base/versions.ts`;
	let contents = tree.read(filePath).toString();
	contents = replaceSpartanVersions(contents, oldVersion, newVersion);
	tree.write(filePath, contents);
};

export default async function replaceUiVersionGenerator(tree: Tree, options: { newVersion: string }): Promise<void> {
	const relativePackageJsonFilePaths = [
		...(await recursivelyFindRelativePackageJsonFilePaths('libs/ui')),
		// this is going to be our main package going forward which contains all primitives as secondary entry points
		'libs/brain/package.json',
	];

	// this goes into the accordion's package.json, which should always be defined
	// if there is no version there we should definitely not move forward
	const oldVersion = readJsonFile(relativePackageJsonFilePaths[0]).version;
	const newVersion = options.newVersion ?? process.env.VERSION;

	if (!oldVersion) {
		console.error(
			"Unable to find old version in our accordion's package.json, which we use as source of truth because its good enough.",
		);
		return;
	}

	if (!newVersion) {
		console.error('Must define a VERSION environment variable to use with this script.');
		return;
	}

	if (oldVersion === newVersion) {
		console.error('Old version cannot be the same as new version');
		return;
	}

	console.log(`Updating UI libs version from ${oldVersion} to ${newVersion}`);

	for (const packageJsonPath of relativePackageJsonFilePaths) {
		updateJson(tree, packageJsonPath, (pkgJson) => {
			const peerDependencyKeysToUpdate = getSpartanDependencyKeys(pkgJson.peerDependencies);

			pkgJson.version = newVersion;

			for (const key of peerDependencyKeysToUpdate) {
				pkgJson.peerDependencies[key] = newVersion;
			}

			return pkgJson;
		});
	}

	console.log(`Reflecting those changes in versions.ts file of the CLI`);
	replaceUiVersionInCliVersionsFile(tree, oldVersion, newVersion);

	await formatFiles(tree);
}
