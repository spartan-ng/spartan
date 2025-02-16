import { formatFiles, generateFiles, names, readJson, readProjectConfiguration, Tree } from '@nx/devkit';
import * as path from 'path';
import { HelmStoryGeneratorSchema } from './schema';

export async function helmStoryGenerator(tree: Tree, options: HelmStoryGeneratorSchema) {
	const { root, name } = readProjectConfiguration(tree, options.project);

	if (!name) {
		throw new Error(`Could not find project name in workspace: ${options.project}`);
	}

	// names are in the format ui-checkbox-helm, we want to discard ui- and -helm
	const normalizedName = name.replace(/^ui-/, '').replace(/-helm$/, '');

	// derive the story name from the normalizedName - e.g. radio-button => Radio Button
	const storyName = normalizedName
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');

	// derive the imports name from the normalizedName - e.g. radio-button => HlmRadioButtonImports
	const componentImports = `Hlm${normalizedName
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join('')}Imports`;

	const { name: importPath } = readJson(tree, path.join(root, 'package.json'));

	const projectRoot = path.join(root, '..');

	generateFiles(tree, path.join(__dirname, 'files'), projectRoot, {
		fileName: names(options.componentName).fileName,
		componentName: options.componentName,
		componentImports,
		importPath,
		storyName,
	});

	await formatFiles(tree);
}

export default helmStoryGenerator;
