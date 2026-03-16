import { type Tree, joinPathFragments, logger, visitNotIgnoredFiles } from '@nx/devkit';
import { createStyleMap, transformStyle } from '@spartan-ng/cli';

function getComponentDirectories(tree: Tree, basePath: string): string[] {
	if (!tree.exists(basePath)) {
		logger.warn(`Base components directory not found: ${basePath}`);
		return [];
	}

	return tree.children(basePath).filter((name) => {
		const fullPath = joinPathFragments(basePath, name);
		return tree.isFile(fullPath) === false; // Only directories
	});
}

function extractImports(code: string) {
	const importRegex = /import[\s\S]*?from\s+['"][^'"]+['"];?/g;

	const imports = code.match(importRegex) ?? [];

	const body = code.replace(importRegex, '').trim();

	return { imports, body };
}

export async function extractPrimitiveCodeGenerator(tree: Tree): Promise<void> {
	logger.info('Extract Primitive Code generator running...');

	const componentsDir = 'apps/app/src/app/pages/(components)/components';
	const componentDirs = getComponentDirectories(tree, componentsDir);

	const styleContent = tree.read('libs/registry/src/styles/style-vega.css', 'utf-8');

	const styleMap = createStyleMap(styleContent);

	if (componentDirs.length === 0) {
		logger.info('No component directories found. Writing empty snippets file.');
	} else {
		logger.info(`Found ${componentDirs.length} component directories.`);
	}

	for (const primitiveName of componentDirs.filter((a) => a === '(sidebar)')) {
		const name = primitiveName.replace('(', '').replace(')', '');
		const templateDir = `libs/cli/src/generators/ui/libs/${name}/files/lib`;

		const files: string[] = [];

		visitNotIgnoredFiles(tree, templateDir, (filePath) => {
			files.push(filePath);
		});

		const importSet = new Set<string>();
		const bodies: string[] = [];
		for (const filePath of files) {
			const content = tree.read(filePath, 'utf-8');
			if (!content) continue;

			const transformed = await transformStyle(content, { styleMap });

			const { imports, body } = extractImports(transformed);

			imports.forEach((i) => importSet.add(i.trim()));

			bodies.push(body);
		}

		const combined = [...importSet].join('\n') + '\n\n' + bodies.join('\n\n');

		const targetPath = joinPathFragments(componentsDir, primitiveName, `${primitiveName}.manual-installation.ts`);

		tree.write(targetPath, combined);

		console.log(combined);
	}

	// const combinedContent = [...importSet].join('\n') + '\n\n' + bodies.join('\n\n');

	// const targetPath = joinPathFragments('apps/app/src/components/ui', `${name}.ts`);

	// tree.write(targetPath, combinedContent);

	// const targetPath = joinPathFragments('apps/app/src/components/ui', `${name}.ts`);

	// console.log(combinedContent.replaceAll('<%- importAlias %>', '@spartan-ng/helm'));
	// tree.write(targetPath, combinedContent);
}
// const outputPath = 'apps/app/src/public/data/primitives-snippets.json';
// tree.write(outputPath, JSON.stringify(allPrimitivesSnippets, null, 2));
// logger.info(`Generated primitives snippets at: ${outputPath}`);
//
// await formatFiles(tree);
// logger.info('Code generation complete!');

export default extractPrimitiveCodeGenerator;
