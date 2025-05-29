import { type Tree, generateFiles } from '@nx/devkit';
import * as path from 'node:path';
import type { HlmToCliGeneratorGeneratorSchema } from '../schema';

function deleteSpecFiles(tree: Tree, dir: string) {
	const files = recursivelyFindFiles(tree, dir).filter((file) => file.endsWith('.spec.ts'));
	files.forEach((file) => {
		tree.delete(file);
	});
}

export const copyFilesFromHlmLibToGenerator = (
	tree: Tree,
	srcPath: string,
	filesPath: string,
	options: HlmToCliGeneratorGeneratorSchema,
) => {
	try {
		generateFiles(tree, srcPath, filesPath, options);
	} catch (error) {
		console.error('Error copying files from HLM lib to generator:', error);
	}
	tree.delete(path.join(filesPath, 'test-setup.ts'));
	deleteSpecFiles(tree, filesPath);
	renameToTemplate(tree, filesPath);
};

export const createSharedGeneratorFiles = (
	tree: Tree,
	projectRoot: string,
	options: HlmToCliGeneratorGeneratorSchema,
	entrypoint: string,
) => {
	generateFiles(tree, path.join(__dirname, '..', 'files'), projectRoot, {
		...options,
		primitiveName: entrypoint,
		internalName: `ui-${entrypoint}-helm`,
		publicName: `ui-${entrypoint}-helm`,
	});
};

export function renameToTemplate(tree: Tree, filePath: string) {
	const files = recursivelyFindFiles(tree, filePath);

	files.forEach((file) => {
		tree.rename(file, `${file}.template`);
	});
}

export function recursivelyDelete(tree: Tree, filePath: string) {
	const files = recursivelyFindFiles(tree, filePath);
	files.forEach((file) => tree.delete(file));
}

/**
 * Recursively find all the files in a directory.
 * @param tree The tree object
 * @param dir The directory to search
 * @returns An array of file paths
 */
export function recursivelyFindFiles(tree: Tree, dir: string) {
	const files: string[] = [];

	for (const file of tree.children(dir)) {
		const filePath = path.join(dir, file);

		if (tree.isFile(filePath)) {
			files.push(filePath);
		} else {
			files.push(...recursivelyFindFiles(tree, filePath));
		}
	}
	return files;
}
