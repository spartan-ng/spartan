import type { Tree } from '@nx/devkit';
import { join } from 'path/posix';

export function deleteFiles(tree: Tree, path: string) {
	if (tree.isFile(path)) {
		tree.delete(path);
		return;
	}

	const files = tree.children(path);

	for (const file of files) {
		deleteFiles(tree, join(path, file));
	}
}
