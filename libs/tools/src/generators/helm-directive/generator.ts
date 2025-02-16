import { formatFiles, generateFiles, joinPathFragments, names, readProjectConfiguration, Tree } from '@nx/devkit';
import * as path from 'path';
import { addExportStatement, addImportStatement, addToExportConstArray } from '../utils/ast';
import { HelmDirectiveGeneratorSchema } from './schema';

export async function helmDirectiveGenerator(tree: Tree, options: HelmDirectiveGeneratorSchema) {
	const { root } = readProjectConfiguration(tree, options.project);
	const { fileName, className } = names(options.directiveName);
	const directivePath = joinPathFragments(root, 'src', 'lib');

	generateFiles(tree, path.join(__dirname, 'files'), directivePath, {
		fileName,
		directiveName: `Hlm${className}Directive`,
		selector: `hlm${className}`,
	});

	// the path to the index.ts file
	const indexPath = joinPathFragments(root, 'src', 'index.ts');
	let sourceCode = tree.read(indexPath, 'utf-8');

	sourceCode = addImportStatement(
		sourceCode,
		`import { Hlm${className}Directive } from './lib/hlm-${fileName}.directive';`,
	);
	sourceCode = addExportStatement(sourceCode, `export * from './lib/hlm-${fileName}.directive';`);
	sourceCode = addToExportConstArray(sourceCode, `Hlm${className}Directive`);

	tree.write(indexPath, sourceCode);

	await formatFiles(tree);
}

export default helmDirectiveGenerator;
