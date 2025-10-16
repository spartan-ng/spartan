import { formatFiles, generateFiles, joinPathFragments, names, readProjectConfiguration, type Tree } from '@nx/devkit';
import * as path from 'path';
import { addExportStatement, addImportStatement, addToExportConstArray } from '../utils/ast';
import type { HelmComponentGeneratorSchema } from './schema';

export async function helmComponentGenerator(tree: Tree, options: HelmComponentGeneratorSchema) {
	const { root } = readProjectConfiguration(tree, 'helm');
	const { fileName, className } = names(options.componentName);

	const componentPath = joinPathFragments(root, options.entrypoint, 'src', 'lib');

	generateFiles(tree, path.join(__dirname, 'files'), componentPath, {
		fileName,
		componentName: `Hlm${className}Component`,
		selector: `hlm-${fileName}`,
	});

	// the path to the index.ts file
	const indexPath = joinPathFragments(root, options.entrypoint, 'src', 'index.ts');
	let sourceCode = tree.read(indexPath, 'utf-8');

	sourceCode = addImportStatement(
		sourceCode,
		`import { Hlm${className}Component } from './lib/hlm-${fileName}.component';`,
	);
	sourceCode = addExportStatement(sourceCode, `export * from './lib/hlm-${fileName}.component';`);
	sourceCode = addToExportConstArray(sourceCode, `Hlm${className}Component`);

	tree.write(indexPath, sourceCode);

	await formatFiles(tree);
}

export default helmComponentGenerator;
