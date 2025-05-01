import { type Tree, generateFiles } from '@nx/devkit';
import * as path from 'node:path';
import type { HlmToCliGeneratorGeneratorSchema } from '../schema';

function deleteSpecFiles(tree: Tree, dir: string) {
	for (const entry of tree.children(dir)) {
		const fullPath = path.join(dir, entry);

		if (tree.isFile(fullPath)) {
			if (fullPath.endsWith('.spec.ts')) {
				tree.delete(fullPath);
			}
		} else {
			deleteSpecFiles(tree, fullPath);
		}
	}
}

export const copyFilesFromHlmLibToGenerator = (
	tree: Tree,
	srcPath: string,
	filesPath: string,
	options: HlmToCliGeneratorGeneratorSchema,
) => {
	generateFiles(tree, srcPath, filesPath, options);
	tree.delete(path.join(filesPath, 'test-setup.ts'));
	deleteSpecFiles(tree, filesPath);
	recursivelyRenameToTemplate(tree, filesPath);
};

export const createSharedGeneratorFiles = (
	tree: Tree,
	projectRoot: string,
	options: HlmToCliGeneratorGeneratorSchema,
) => {
	generateFiles(tree, path.join(__dirname, '..', 'files'), projectRoot, options);
};

export const recursivelyRenameToTemplate = (tree: Tree, filePath: string) => {
	tree.children(filePath).forEach((child) => {
		const childPath = path.join(filePath, child);
		if (tree.isFile(childPath)) {
			tree.rename(childPath, `${childPath}.template`);
		} else {
			recursivelyRenameToTemplate(tree, childPath);
		}
	});
};

export const recursivelyDelete = (tree: Tree, filePath: string) => {
	tree.children(filePath).forEach((child) => {
		const childPath = path.join(filePath, child);
		if (tree.isFile(childPath)) {
			tree.delete(childPath);
		} else {
			recursivelyDelete(tree, childPath);
		}
	});
};
