import { Tree, visitNotIgnoredFiles } from '@nx/devkit';

export function visitFiles(tree: Tree, dirPath: string, visitor: (path: string) => void): void {
	visitNotIgnoredFiles(tree, dirPath, (path) => {
		// if the file is part of the generators we want to skip as we don't want it updating the code that is performing the updates
		if (path.includes('libs/cli/src/generators')) {
			return;
		}
		visitor(path);
	});
}
