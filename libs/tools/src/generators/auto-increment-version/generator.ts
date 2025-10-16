import { type Tree, formatFiles, readJsonFile } from '@nx/devkit';
import replaceCliVersionGenerator from '../replace-cli-version/generator';
import replaceUiVersionGenerator from '../replace-ui-version/generator';

export default async function autoIncrementVersion(tree: Tree): Promise<void> {
	const oldVersion = readJsonFile('libs/brain/package.json').version as string;
	const [prefix, branchAndNumber] = oldVersion.split('-');
	const [branch, versionNumber] = branchAndNumber.split('.');
	const newVersionNumber = +versionNumber + 1;

	const newVersion = `${prefix}-${branch}.${newVersionNumber}`;

	console.log(
		`preparing release with auto-incremented version ${newVersion} which should be 1 more than ${oldVersion}`,
	);

	await replaceUiVersionGenerator(tree, { newVersion });
	await replaceCliVersionGenerator(tree, { newVersion });

	await formatFiles(tree);
}
