import { librarySecondaryEntryPointGenerator } from '@nx/angular/generators';
import { formatFiles, joinPathFragments, names, type Tree } from '@nx/devkit';
import helmComponentGenerator from '../helm-component/generator';
import helmDirectiveGenerator from '../helm-directive/generator';
import helmDocumentationGenerator from '../helm-documentation/generator';
import { helmStoryGenerator } from '../helm-story/generator';
import type { HelmSecondaryEntrypointGeneratorSchema } from './schema';

export async function helmSecondaryEntrypointGenerator(tree: Tree, options: HelmSecondaryEntrypointGeneratorSchema) {
	const { fileName: normalizedName, className } = names(options.name);

	await librarySecondaryEntryPointGenerator(tree, {
		name: options.name,
		library: 'helm',
		skipFormat: true,
		skipModule: true,
	});

	const sourceRoot = `libs/helm/${normalizedName}/src`;

	// empty the index.ts file
	tree.write(joinPathFragments(sourceRoot, 'index.ts'), `export const Hlm${className}Imports = [] as const;`);

	// create the generator files
	const generatorPath = joinPathFragments(
		'libs',
		'cli',
		'src',
		'generators',
		'ui',
		'libs',
		normalizedName,
		'generator.ts',
	);

	tree.write(
		generatorPath,
		`import type { Tree } from '@nx/devkit';
import hlmBaseGenerator from '../../../base/generator';
import type { HlmBaseGeneratorSchema } from '../../../base/schema';

export async function generator(tree: Tree, options: HlmBaseGeneratorSchema) {
	return await hlmBaseGenerator(tree, {
		...options,
		name: '${normalizedName}',
	});
}`,
	);

	if (options.story) {
		await helmStoryGenerator(tree, {
			entrypoint: normalizedName,
			componentName: `Hlm${className}`,
		});
	}

	if (options.generate === 'component') {
		await helmComponentGenerator(tree, {
			entrypoint: normalizedName,
			componentName: normalizedName,
		});
	} else if (options.generate === 'directive') {
		await helmDirectiveGenerator(tree, {
			entrypoint: normalizedName,
			directiveName: normalizedName,
		});
	}

	if (options.documentation) {
		await helmDocumentationGenerator(tree, {
			name: options.name,
			description: options.description ?? 'TODO: Add a description',
		});
	}

	await formatFiles(tree);
}

export default helmSecondaryEntrypointGenerator;
