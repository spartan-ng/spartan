import { type Tree, readJsonFile } from '@nx/devkit';
import { recursivelyFindRelativePackageJsonFilePaths } from '../../utils/recursively-find-relative-package-json-file-paths';
import replaceCliVersionGenerator from '../replace-cli-version/generator';
import replaceUiVersionGenerator from '../replace-ui-version/generator';

export default async function autoIncrementVersion(tree: Tree): Promise<void> {
	const relativePackageJsonFilePaths = await recursivelyFindRelativePackageJsonFilePaths('libs/ui');

	// this goes into the accordion's package.json, which should always be defined
	// if there is no version there we should definitely not move forward
	const oldVersion = readJsonFile(relativePackageJsonFilePaths[0]).version as string;
	const [prefix, branchAndNumber] = oldVersion.split('-');
	const [branch, versionNumber] = branchAndNumber.split('.');
	const newVersionNumber = +versionNumber + 1;

	const newVersion = `${prefix}-${branch}.${newVersionNumber}`;

	console.log(
		`preparing release with auto-incremented version ${newVersion} which should be 1 more than ${oldVersion}`,
	);

	await replaceUiVersionGenerator(tree, { newVersion });
	await replaceCliVersionGenerator(tree, { newVersion });
}
