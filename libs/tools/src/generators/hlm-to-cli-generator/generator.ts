import { formatFiles, readJson, readProjectConfiguration, type Tree, writeJson } from '@nx/devkit';
import * as path from 'node:path';
import { basename } from 'node:path';
import type { PackageJson } from 'nx/src/utils/package-json';
import { addPrimitiveToSupportedUILibraries } from './lib/add-primitive-to-supported-ui-libraries';
import {
	copyFilesFromHlmLibToGenerator,
	createSharedGeneratorFiles,
	recursivelyDelete,
	recursivelyFindFiles,
} from './lib/file-management';
import type { HlmToCliGeneratorGeneratorSchema } from './schema';

const outputDir = 'libs/cli/src/generators/ui';

async function createGeneratorFromHlmLibrary(
	tree: Tree,
	entrypoint: string,
	options: HlmToCliGeneratorGeneratorSchema,
) {
	const supportedUILibsJsonPath = path.join(outputDir, 'supported-ui-libraries.json');

	// delete the current generator if it exists
	const generatorPath = path.join(outputDir, 'libs', entrypoint);

	if (tree.exists(generatorPath)) {
		recursivelyDelete(tree, generatorPath);
	}

	// detect the peer dependencies of the entrypoint
	const peerDependencies = getPeerDependencies(tree, entrypoint);

	const srcPath = path.join('libs/helm', entrypoint, 'src');
	const projectRoot = path.join(outputDir, 'libs', entrypoint);
	const filesPath = path.join(projectRoot, 'files');

	addPrimitiveToSupportedUILibraries(tree, supportedUILibsJsonPath, entrypoint, entrypoint, peerDependencies);
	copyFilesFromHlmLibToGenerator(tree, srcPath, filesPath, options);
	createSharedGeneratorFiles(tree, projectRoot, options, entrypoint);
}

export async function hlmCliNxGeneratorGenerator(tree: Tree, options: HlmToCliGeneratorGeneratorSchema) {
	// empty the output json file - this ensures that we don't include any old entries
	writeJson(tree, path.join(outputDir, 'supported-ui-libraries.json'), {});

	// get all the entrypoints within the helm library
	const entrypoints = getEntrypoints(tree);

	for (const entrypoint of entrypoints) {
		createGeneratorFromHlmLibrary(tree, entrypoint, options);
	}

	await formatFiles(tree);
}

export default hlmCliNxGeneratorGenerator;

function getEntrypoints(tree: Tree) {
	const project = readProjectConfiguration(tree, 'helm');

	// we need to iterate over every directory in the project and if it contains an ng-package.json file, we need to add it to the entrypoints
	const entrypoints = [];
	const sourceRoot = project.root;

	for (const file of tree.children(sourceRoot)) {
		const entrypointDir = path.join(sourceRoot, file);

		if (!tree.isFile(entrypointDir)) {
			const ngPackageJsonPath = path.join(entrypointDir, 'ng-package.json');
			if (tree.exists(ngPackageJsonPath)) {
				entrypoints.push(basename(entrypointDir));
			}
		}
	}
	return entrypoints;
}

/**
 * Get the source files of the entrypoint.
 * @param tree The tree object
 * @param entrypoint The entrypoint to scan
 * @returns An array of file paths
 */
function getEntrypointSourceFiles(tree: Tree, entrypoint: string) {
	const project = readProjectConfiguration(tree, 'helm');
	const entrypointPath = path.join(project.root, entrypoint);

	if (!tree.exists(entrypointPath)) {
		throw new Error(`The entrypoint ${entrypoint} does not exist at ${entrypointPath}`);
	}

	return recursivelyFindFiles(tree, entrypointPath).filter((file) => file.endsWith('.ts'));
}

/**
 * Scan the files in the entrypoint and find all the peer dependencies that are used in the files.
 * @param tree The tree object
 * @param entrypoint The entrypoint to scan
 * @returns A map of peer dependencies and their versions
 */
function getPeerDependencies(tree: Tree, entrypoint: string) {
	const project = readProjectConfiguration(tree, 'helm');
	const entrypointPath = path.join(project.root, entrypoint);

	if (!tree.exists(entrypointPath)) {
		throw new Error(`The entrypoint ${entrypoint} does not exist at ${entrypointPath}`);
	}

	const packageJsonPath = path.join(project.root, 'package.json');

	if (!tree.exists(packageJsonPath)) {
		throw new Error(`The package.json file does not exist at ${packageJsonPath}`);
	}

	const allPeerDependencies = readJson<PackageJson>(tree, packageJsonPath).peerDependencies;

	const tsFiles = getEntrypointSourceFiles(tree, entrypoint);

	const peerDependencies: Record<string, string> = {};

	for (const file of tsFiles) {
		const fileContent = tree.read(file, 'utf-8');

		for (const [dependency, version] of Object.entries(allPeerDependencies)) {
			if (fileContent.includes(dependency)) {
				peerDependencies[dependency] = version;
			}
		}
	}
	return peerDependencies;
}
