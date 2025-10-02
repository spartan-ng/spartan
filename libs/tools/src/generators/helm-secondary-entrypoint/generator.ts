import { librarySecondaryEntryPointGenerator } from '@nx/angular/generators';
import { formatFiles, joinPathFragments, names, type Tree } from '@nx/devkit';
import helmComponentGenerator from '../helm-component/generator';
import helmDirectiveGenerator from '../helm-directive/generator';
import helmDocumentationGenerator from '../helm-documentation/generator';
import { helmStoryGenerator } from '../helm-story/generator';
import type { HelmSecondaryEntrypointGeneratorSchema } from './schema';

export async function helmSecondaryEntrypointGenerator(tree: Tree, options: HelmSecondaryEntrypointGeneratorSchema) {
	const { fileName: normalizedName, className } = names(options.name);

	const internalName = `ui-${normalizedName}-helm`;

	await librarySecondaryEntryPointGenerator(tree, {
		name: options.name,
		library: 'helm',
		skipFormat: true,
		skipModule: true,
	});

	const sourceRoot = `libs/helm/${normalizedName}/src`;

	// empty the index.ts file
	tree.write(
		joinPathFragments(sourceRoot, 'index.ts'),
		`import { NgModule } from '@angular/core';

export const Hlm${className}Imports = [] as const;

@NgModule({
	imports: [...Hlm${className}Imports],
	exports: [...Hlm${className}Imports],
})
export class Hlm${className}Module {}`,
	);

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
		primitiveName: '${normalizedName}',
		internalName: '${internalName}',
		publicName: '${normalizedName}',
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
