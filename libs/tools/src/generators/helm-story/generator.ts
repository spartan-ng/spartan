import { formatFiles, generateFiles, names, type Tree } from '@nx/devkit';
import * as path from 'path';
import type { HelmStoryGeneratorSchema } from './schema';

export async function helmStoryGenerator(tree: Tree, options: HelmStoryGeneratorSchema) {
	// derive the story name from the normalizedName - e.g. radio-button => Radio Button
	const storyName = options.entrypoint
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');

	// derive the imports name from the normalizedName - e.g. radio-button => HlmRadioButtonImports
	const componentImports = `Hlm${options.entrypoint
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join('')}Imports`;

	const storyDir = 'apps/ui-storybook/stories';

	generateFiles(tree, path.join(__dirname, 'files'), storyDir, {
		fileName: names(options.componentName).fileName,
		componentName: options.componentName,
		componentImports,
		importPath: `@spartan-ng/helm/${options.entrypoint}`,
		storyName,
	});

	await formatFiles(tree);
}

export default helmStoryGenerator;
