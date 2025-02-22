import { VERSION } from '@angular/core';
import { libraryGenerator, UnitTestRunner } from '@nx/angular/generators';
import {
	formatFiles,
	joinPathFragments,
	names,
	readProjectConfiguration,
	Tree,
	updateJson,
	updateProjectConfiguration,
} from '@nx/devkit';
import helmComponentGenerator from '../helm-component/generator';
import helmDirectiveGenerator from '../helm-directive/generator';
import helmDocumentationGenerator from '../helm-documentation/generator';
import { helmStoryGenerator } from '../helm-story/generator';
import { HelmLibraryGeneratorSchema } from './schema';

export async function helmLibraryGenerator(tree: Tree, options: HelmLibraryGeneratorSchema) {
	const { fileName: normalizedName, className } = names(options.name);
	const projectName = `ui-${normalizedName}-helm`;

	await libraryGenerator(tree, {
		name: projectName,
		directory: joinPathFragments('libs', 'ui', normalizedName, 'helm'),
		importPath: `@spartan-ng/ui-${normalizedName}-helm`,
		prefix: 'hlm',
		linter: 'eslint',
		standalone: true,
		strict: true,
		inlineStyle: true,
		inlineTemplate: true,
		unitTestRunner: UnitTestRunner.Jest,
		publishable: false,
		buildable: true,
		skipModule: true,
		tags: 'scope:helm',
	});

	// add the release target to the project.json
	const configuration = readProjectConfiguration(tree, projectName);

	// add the release target to the project.json
	updateProjectConfiguration(tree, projectName, {
		...configuration,
		targets: {
			...configuration.targets,
			release: {
				executor: '@spartan-ng/tools:build-update-publish',
				options: {
					libName: projectName,
				},
			},
		},
	});

	// remove the default component
	tree.delete(
		joinPathFragments('libs', 'ui', normalizedName, 'helm', 'src', 'lib', projectName, `${projectName}.component.ts`),
	);
	tree.delete(
		joinPathFragments(
			'libs',
			'ui',
			normalizedName,
			'helm',
			'src',
			'lib',
			projectName,
			`${projectName}.component.spec.ts`,
		),
	);

	// empty the index.ts file
	tree.write(
		joinPathFragments('libs', 'ui', normalizedName, 'helm', 'src', 'index.ts'),
		`import { NgModule } from '@angular/core';

export const Hlm${className}Imports = [] as const;

@NgModule({
	imports: [...Hlm${className}Imports],
	exports: [...Hlm${className}Imports],
})
export class Hlm${className}Module {}`,
	);

	// update the supported libraries json
	const supportedLibrariesPath = joinPathFragments(
		'libs',
		'cli',
		'src',
		'generators',
		'ui',
		'supported-ui-libraries.json',
	);

	updateJson(tree, supportedLibrariesPath, (json) => {
		json[normalizedName.replaceAll('-', '')] = {
			internalName: projectName,
			peerDependencies: {
				'@angular/core': `>=${VERSION.major}.0.0`,
				'class-variance-authority': '^0.7.0',
				clsx: '^2.1.1',
			},
		};
		return json;
	});

	// create the generator files
	const generatorPath = joinPathFragments(
		'libs',
		'cli',
		'src',
		'generators',
		'ui',
		'libs',
		projectName,
		'generator.ts',
	);

	tree.write(
		generatorPath,
		`import { Tree } from '@nx/devkit';
import hlmBaseGenerator from '../../../base/generator';
import type { HlmBaseGeneratorSchema } from '../../../base/schema';

export async function generator(tree: Tree, options: HlmBaseGeneratorSchema) {
	return await hlmBaseGenerator(tree, {
		...options,
		primitiveName: '${normalizedName}',
		internalName: '${projectName}',
		publicName: '${projectName}',
	});
}`,
	);

	if (options.story) {
		await helmStoryGenerator(tree, {
			project: projectName,
			componentName: `Hlm${className}Component`,
		});
	}

	if (options.generate === 'component') {
		await helmComponentGenerator(tree, {
			project: projectName,
			componentName: normalizedName,
		});
	} else if (options.generate === 'directive') {
		await helmDirectiveGenerator(tree, {
			project: projectName,
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

export default helmLibraryGenerator;
