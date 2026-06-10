import { type Tree, formatFiles, readJsonFile } from '@nx/devkit';
import replaceCliVersionGenerator from '../replace-cli-version/generator';
import replaceMcpVersionGenerator from '../replace-mcp-version/generator';
import replaceUiVersionGenerator from '../replace-ui-version/generator';

export default async function autoIncrementVersion(tree: Tree): Promise<void> {
	const brainPackageJsonPath = 'libs/brain/package.json';
	const oldVersion = readJsonFile(brainPackageJsonPath).version as string;

	const match = oldVersion?.match(/^(.+)-(.+)\.(\d+)$/);
	if (!match) {
		throw new Error(
			`auto-increment-version: expected ${brainPackageJsonPath} version to look like "<prefix>-<branch>.<number>" ` +
				`(e.g. 0.0.1-alpha.707) but found "${oldVersion}".`,
		);
	}

	const [, prefix, branch, versionNumber] = match;
	const newVersion = `${prefix}-${branch}.${+versionNumber + 1}`;

	console.log(
		`preparing release with auto-incremented version ${newVersion} which should be 1 more than ${oldVersion}`,
	);

	await replaceUiVersionGenerator(tree, { newVersion });
	await replaceCliVersionGenerator(tree, { newVersion });
	await replaceMcpVersionGenerator(tree, { newVersion });

	await formatFiles(tree);
}
